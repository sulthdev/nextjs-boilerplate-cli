#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import shell from "shelljs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  if (!string || typeof string !== "string") return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const program = new Command();

// Define CLI version and description
program
  .version("1.0.0")
  .description(
    "Enhance an existing Next.js project with a detailed boilerplate"
  );

// Detect the current project setup
function detectProjectSetup() {
  const hasSrc = fs.existsSync(path.join(process.cwd(), "src"));
  const hasApp = fs.existsSync(
    path.join(process.cwd(), hasSrc ? "src/app" : "app")
  );
  const hasPages = fs.existsSync(
    path.join(process.cwd(), hasSrc ? "src/pages" : "pages")
  );

  let routerType = "Pages Router";
  if (hasApp) {
    routerType = "App Router";
  } else if (hasPages) {
    routerType = "Pages Router";
  } else {
    console.log(
      chalk.red(
        "Error: Neither App Router nor Pages Router found. Ensure your Next.js project has an `app` or `pages` directory."
      )
    );
    process.exit(1);
  }

  return { routerType, hasSrc, hasPages };
}

// Enhance the project based on user input
function enhanceProject({ routerType, baseFolder }) {
  const folderStructures = {
    "App Router": [
      `${baseFolder}/components/ui`,
      `${baseFolder}/hooks`,
      `${baseFolder}/lib`,
      `${baseFolder}/services`,
      `${baseFolder}/styles`,
      `${baseFolder}/types`,
      `${baseFolder}/utils`,
      `${baseFolder}/app/api`, // Added App Router-specific API folder
    ],
    "Pages Router": [
      `${baseFolder}/pages/api`,
      `${baseFolder}/components/ui`,
      `${baseFolder}/hooks`,
      `${baseFolder}/lib`,
      `${baseFolder}/services`,
      `${baseFolder}/styles`,
      `${baseFolder}/types`,
      `${baseFolder}/utils`,
    ],
  };

  const pathToTemplates = path.join(__dirname, "templates");

  const templates = {
    "App Router": {
      layout: path.join(pathToTemplates, "app/layout.template.tsx"),
      error: path.join(pathToTemplates, "app/error.template.tsx"),
      page: path.join(pathToTemplates, "app/page.template.tsx"),
      lib: {
        api: path.join(pathToTemplates, "lib/api.template.ts"),
        constants: path.join(pathToTemplates, "lib/constants.template.ts"),
      },
    },
    "Pages Router": {
      app: path.join(pathToTemplates, "pages/_app.template.tsx"),
      error: path.join(pathToTemplates, "pages/_error.template.tsx"),
      index: path.join(pathToTemplates, "pages/index.template.tsx"),
      lib: {
        api: path.join(pathToTemplates, "lib/api.template.ts"),
        constants: path.join(pathToTemplates, "lib/constants.template.ts"),
      },
    },
  };

  // Create folders
  folderStructures[routerType].forEach((folder) => {
    const fullPath = path.join(process.cwd(), folder);
    if (!fs.existsSync(fullPath)) {
      shell.mkdir("-p", fullPath);
      console.log(chalk.green(`Created: ${folder}`));
    } else {
      console.log(chalk.yellow(`Skipped: ${folder} (already exists)`));
    }
  });

  // Create files from templates
  const libTemplates = templates[routerType].lib;
  Object.entries(libTemplates).forEach(([key, templatePath]) => {
    const outputFile = path.join(process.cwd(), `${baseFolder}/lib/${key}.ts`);
    if (!fs.existsSync(outputFile)) {
      const content = fs.readFileSync(templatePath, "utf-8");
      fs.writeFileSync(
        outputFile,
        `// TODO: Change this file according to your exact requirement.\n\n${content}`
      );
      console.log(chalk.green(`Created: ${outputFile}`));
    } else {
      console.log(chalk.yellow(`Skipped: ${outputFile} (already exists)`));
    }
  });

  Object.entries(templates[routerType]).forEach(([key, templatePath]) => {
    if (key === "lib") return; // Skip lib files already processed
    const outputFile = path.join(
      process.cwd(),
      `${baseFolder}/${routerType === "App Router" ? "app" : "pages"}`,
      `${key}.tsx`
    );
    if (!fs.existsSync(outputFile)) {
      const content = fs.readFileSync(templatePath, "utf-8");
      fs.writeFileSync(
        outputFile,
        `// TODO: Change this file according to your exact requirement.\n\n${content}`
      );
      console.log(chalk.green(`Created: ${outputFile}`));
    } else {
      console.log(chalk.yellow(`Skipped: ${outputFile} (already exists)`));
    }
  });

  console.log(chalk.green("Project enhanced successfully!"));
  console.log(
    chalk.blue(
      "\nNote: You can modify the structure according to your needs; this is just a starting point to help you get started."
    )
  );
}

// Command to add boilerplate to an existing project
program
  .command("add")
  .description(
    "Add detailed boilerplate structure to an existing Next.js project"
  )
  .action(async () => {
    console.log(
      chalk.blue("Enhancing your Next.js project with boilerplate...")
    );

    if (!fs.existsSync(path.join(process.cwd(), "package.json"))) {
      console.log(
        chalk.red("Error: No package.json found. Are you in a Next.js project?")
      );
      return;
    }

    const detectedSetup = detectProjectSetup();

    console.log(
      chalk.blue(
        `Detected router type: ${detectedSetup.routerType}. Proceeding with the detected setup.`
      )
    );

    const answers = await inquirer.prompt([
      {
        type: "confirm",
        name: "useSrc",
        message: "Does your project use a src/ folder?",
        default: detectedSetup.hasSrc,
      },
      {
        type: "confirm",
        name: "createSrc",
        message: "Do you want to create a src/ folder?",
        default: true,
        when: (answers) => !answers.useSrc,
      },
    ]);

    const baseFolder = detectedSetup.hasSrc || answers.createSrc ? "src" : "";

    enhanceProject({
      routerType: detectedSetup.routerType,
      baseFolder,
    });

    console.log(chalk.blue("Installing Axios dependency..."));
    const installCommand = fs.existsSync("yarn.lock")
      ? "yarn add"
      : "npm install";
    const dependencies = ["axios"];
    const result = shell.exec(`${installCommand} ${dependencies.join(" ")}`);

    if (result.code === 0) {
      console.log(chalk.green("Axios installed successfully!"));
    } else {
      console.log(chalk.red("Error installing Axios. Check your setup."));
    }
  });

// Command to add Redux setup
program
  .command("add-redux")
  .description("Add Redux Toolkit setup to your Next.js project")
  .action(async () => {
    console.log(chalk.blue("Adding Redux Toolkit setup to your project..."));

    const detectedSetup = detectProjectSetup();
    const baseFolder = detectedSetup.hasSrc ? "src" : "";
    const routerType = detectedSetup.routerType;

    await setupRedux({ baseFolder, routerType });
  });

async function setupRedux({ baseFolder, routerType }) {
  const storeDir = path.join(process.cwd(), `${baseFolder}/store`);
  const sliceDir = path.join(storeDir, "slices");

  // Ensure the directories exist
  if (!fs.existsSync(storeDir)) {
    shell.mkdir("-p", storeDir);
    console.log(chalk.green(`Created: ${storeDir}`));
  }

  if (!fs.existsSync(sliceDir)) {
    shell.mkdir("-p", sliceDir);
    console.log(chalk.green(`Created: ${sliceDir}`));
  }

  // Create the store/index.ts file
  const storePath = path.join(storeDir, "index.ts");
  if (!fs.existsSync(storePath)) {
    const initialStoreContent = `// Redux store setup\nimport { configureStore } from '@reduxjs/toolkit';\n\nexport const store = configureStore({\n  reducer: {},\n});\n`;
    fs.writeFileSync(storePath, initialStoreContent);
    console.log(chalk.green(`Created: ${storePath}`));
  }

  // Ensure `generalSlice` is always created
  const generalSlicePath = path.join(sliceDir, "generalSlice.ts");
  if (!fs.existsSync(generalSlicePath)) {
    const generalSliceContent = `// General slice\nimport { createSlice } from '@reduxjs/toolkit';\n\nconst generalSlice = createSlice({\n  name: 'general',\n  initialState: {},\n  reducers: {},\n});\n\nexport const { actions, reducer } = generalSlice;\nexport default reducer;\n`;
    fs.writeFileSync(generalSlicePath, generalSliceContent);
    console.log(chalk.green(`Created: ${generalSlicePath}`));
  } else {
    console.log(chalk.yellow(`Skipped: ${generalSlicePath} (already exists)`));
  }

  // Prompt the user for additional slice names
  const { sliceNames } = await inquirer.prompt([
    {
      type: "input",
      name: "sliceNames",
      message:
        "Enter additional slice names (comma-separated, e.g., user, product):",
      default: "",
    },
  ]);

  // Process additional slices
  const additionalSlices = sliceNames
    ? sliceNames
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name !== "")
    : [];

  // Create additional slices
  additionalSlices.forEach((slice) => {
    const slicePath = path.join(sliceDir, `${slice}Slice.ts`);
    if (!fs.existsSync(slicePath)) {
      const sliceContent = `// ${capitalizeFirstLetter(
        slice
      )} slice\nimport { createSlice } from '@reduxjs/toolkit';\n\nconst ${slice}Slice = createSlice({\n  name: '${slice}',\n  initialState: {},\n  reducers: {},\n});\n\nexport const { actions, reducer } = ${slice}Slice;\nexport default reducer;\n`;
      fs.writeFileSync(slicePath, sliceContent);
      console.log(chalk.green(`Created: ${slicePath}`));
    } else {
      console.log(chalk.yellow(`Skipped: ${slicePath} (already exists)`));
    }
  });

  // Update store/index.ts to include all reducers
  const reducerImports = [`import generalReducer from './slices/generalSlice';`]
    .concat(
      additionalSlices.map(
        (slice) => `import ${slice}Reducer from './slices/${slice}Slice';`
      )
    )
    .join("\n");

  const reducerMapping = [`  general: generalReducer,`]
    .concat(additionalSlices.map((slice) => `  ${slice}: ${slice}Reducer,`))
    .join("\n");

  const storeContent = `// Redux store setup\nimport { configureStore } from '@reduxjs/toolkit';\n\n${reducerImports}\n\nexport const store = configureStore({\n  reducer: {\n${reducerMapping}\n  },\n});\n`;
  fs.writeFileSync(storePath, storeContent);
  console.log(chalk.green(`Updated: ${storePath}`));

  // Display helpful note to the user
  console.log(
    chalk.yellow(
      "\nNote: Don't forget to wrap your app with the Redux Provider.\n"
    )
  );
  console.log(
    chalk.blue(
      routerType === "App Router"
        ? `For App Router, update your \`layout.tsx\` as follows:\n\nimport { Provider } from 'react-redux';\nimport { store } from '../store';\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="en">\n      <body>\n        <Provider store={store}>\n          {children}\n        </Provider>\n      </body>\n    </html>\n  );\n}`
        : `For Pages Router, update your \`_app.tsx\` as follows:\n\nimport { Provider } from 'react-redux';\nimport { store } from '../store';\n\nfunction MyApp({ Component, pageProps }) {\n  return (\n    <Provider store={store}>\n      <Component {...pageProps} />\n    </Provider>\n  );\n}\n\nexport default MyApp;`
    )
  );

  // Install Redux dependencies
  console.log(chalk.blue("Installing Redux dependencies..."));
  const installCommand = fs.existsSync("yarn.lock")
    ? "yarn add"
    : "npm install";
  const dependencies = ["@reduxjs/toolkit", "react-redux"];
  const result = shell.exec(`${installCommand} ${dependencies.join(" ")}`);

  if (result.code === 0) {
    console.log(chalk.green("Redux Toolkit setup completed successfully!"));
  } else {
    console.log(chalk.red("Error installing dependencies. Check your setup."));
  }
}

// Command to add a new module
program
  .command("add-module")
  .description("Add a new module to your Next.js project")
  .action(async () => {
    console.log(chalk.blue("Adding a new module to your Next.js project..."));

    const detectedSetup = detectProjectSetup();

    const { moduleName } = await inquirer.prompt([
      {
        type: "input",
        name: "moduleName",
        message: "What is the module name? (e.g., auth, dashboard)",
        validate: (input) =>
          input.trim() !== "" || "Module name cannot be empty!",
      },
    ]);

    const baseFolder = detectedSetup.hasSrc ? "src" : "";

    const folderPath =
      detectedSetup.routerType === "App Router"
        ? `${baseFolder}/app/(${moduleName})`
        : `${baseFolder}/pages/${moduleName}`;

    const isAuthModule = moduleName.toLowerCase() === "auth";

    if (isAuthModule) {
      console.log(
        chalk.yellow(
          "Note: Since you chose 'auth', we will auto-generate 'login' and 'register' sub-routes using predefined templates."
        )
      );
    }

    const { subRoutes } = await inquirer.prompt([
      {
        type: "input",
        name: "subRoutes",
        message: isAuthModule
          ? "Enter additional sub-route names if needed (comma-separated, e.g., profile):"
          : "Enter sub-route names (comma-separated, e.g., login, register):",
        validate: (input) =>
          input.trim() !== "" || "Sub-route names cannot be empty!",
        when: !isAuthModule,
      },
    ]);

    const subRouteNames = isAuthModule
      ? ["login", "register"]
      : subRoutes
          .split(",")
          .map((name) => name.trim())
          .filter((name) => name !== "");
    if (subRouteNames.length === 0) {
      console.log(chalk.red("Error: No valid sub-route names provided."));
      return;
    }

    if (!fs.existsSync(path.join(process.cwd(), folderPath))) {
      shell.mkdir("-p", path.join(process.cwd(), folderPath));
      console.log(chalk.green(`Created: ${folderPath}`));
    }

    const authTemplates = {
      "App Router": {
        login: path.join(
          __dirname,
          "templates/app/(auth)/login/page.template.tsx"
        ),
        register: path.join(
          __dirname,
          "templates/app/(auth)/register/page.template.tsx"
        ),
      },
      "Pages Router": {
        login: path.join(
          __dirname,
          "templates/pages/auth/login/page.template.tsx"
        ),
        register: path.join(
          __dirname,
          "templates/pages/auth/register/page.template.tsx"
        ),
      },
    };

    subRouteNames.forEach((route) => {
      const routePath =
        detectedSetup.routerType === "App Router"
          ? `${folderPath}/${route}`
          : `${folderPath}/${route}`;
      const filePath = `${routePath}/page.tsx`;

      if (!fs.existsSync(path.join(process.cwd(), routePath))) {
        shell.mkdir("-p", path.join(process.cwd(), routePath));
        console.log(chalk.green(`Created: ${routePath}`));
      }

      if (isAuthModule && ["login", "register"].includes(route)) {
        const templatePath = authTemplates[detectedSetup.routerType][route];
        if (fs.existsSync(templatePath)) {
          const content = fs.readFileSync(templatePath, "utf-8");
          fs.writeFileSync(path.join(process.cwd(), filePath), content);
          console.log(chalk.green(`Created: ${filePath} using template`));
        } else {
          console.log(chalk.red(`Template missing for ${route}!`));
        }
      } else {
        const content = `// TODO: Customize this ${route} page\n\nexport default function ${capitalizeFirstLetter(
          route
        )}Page() {\n  return <div>${capitalizeFirstLetter(
          route
        )} Page</div>;\n}`;
        fs.writeFileSync(path.join(process.cwd(), filePath), content);
        console.log(chalk.green(`Created: ${filePath}`));
      }
    });

    console.log(
      chalk.blue(
        `Module '${moduleName}' has been added with sub-routes: ${subRouteNames.join(
          ", "
        )}`
      )
    );
  });

program.parse(process.argv);
