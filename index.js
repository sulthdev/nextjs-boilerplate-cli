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
  .version("1.0.7")
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
  const typesDir = path.join(process.cwd(), `${baseFolder}/types`);

  // Ensure the necessary directories exist
  [storeDir, sliceDir, typesDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      shell.mkdir("-p", dir);
      console.log(chalk.green(`Created: ${dir}`));
    }
  });

  // Create the store/index.ts file
  const storePath = path.join(storeDir, "index.ts");
  if (!fs.existsSync(storePath)) {
    const initialStoreContent = `// Redux store setup\nimport { configureStore } from '@reduxjs/toolkit';\n\nexport const store = configureStore({\n  reducer: {},\n});\n`;
    fs.writeFileSync(storePath, initialStoreContent);
    console.log(chalk.green(`Created: ${storePath}`));
  }

  // Ensure `generalSlice` is always created
  const generalSlicePath = path.join(sliceDir, "generalSlice.ts");
  const generalTypePath = path.join(typesDir, "general.d.ts");

  if (!fs.existsSync(generalSlicePath)) {
    const generalSliceContent = `import { createSlice } from "@reduxjs/toolkit";\nimport { GeneralState } from "../../types/general";\n\nconst initialState: GeneralState = {\n  data: null,\n};\n\nconst generalSlice = createSlice({\n  name: "general",\n  initialState,\n  reducers: {},\n});\n\nexport const { actions, reducer } = generalSlice;\nexport default reducer;\n`;
    fs.writeFileSync(generalSlicePath, generalSliceContent);
    console.log(chalk.green(`Created: ${generalSlicePath}`));
  }

  if (!fs.existsSync(generalTypePath)) {
    const generalTypeContent = `export interface GeneralState {\n  data: any;\n}`;
    fs.writeFileSync(generalTypePath, generalTypeContent);
    console.log(
      chalk.green(`Created TypeScript interface: ${generalTypePath}`)
    );
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

  additionalSlices.forEach((slice) => {
    const slicePath = path.join(sliceDir, `${slice}Slice.ts`);
    const typePath = path.join(typesDir, `${slice}.d.ts`);

    if (!fs.existsSync(slicePath)) {
      const sliceContent = `import { createSlice } from "@reduxjs/toolkit";\nimport { ${capitalizeFirstLetter(
        slice
      )}State } from "../../types/${slice}";\n\nconst initialState: ${capitalizeFirstLetter(
        slice
      )}State = {\n  data: null,\n};\n\nconst ${slice}Slice = createSlice({\n  name: "${slice}",\n  initialState,\n  reducers: {},\n});\n\nexport const { actions, reducer } = ${slice}Slice;\nexport default reducer;\n`;
      fs.writeFileSync(slicePath, sliceContent);
      console.log(chalk.green(`Created: ${slicePath}`));
    } else {
      console.log(chalk.yellow(`Skipped: ${slicePath} (already exists)`));
    }

    if (!fs.existsSync(typePath)) {
      const typeContent = `export interface ${capitalizeFirstLetter(
        slice
      )}State {\n  data: any;\n}`;
      fs.writeFileSync(typePath, typeContent);
      console.log(chalk.green(`Created TypeScript interface: ${typePath}`));
    } else {
      console.log(chalk.yellow(`Skipped: ${typePath} (already exists)`));
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
  .command("add-module <moduleNames>")
  .description(
    "Add one or more modules (comma-separated, e.g., auth,dashboard) to your Next.js project"
  )
  .option("--with-api", "Generate API routes for the modules", false)
  .option("--with-redux", "Generate Redux slices for the modules", false)
  .action(async (moduleNames, options) => {
    console.log(chalk.blue("Adding modules to your Next.js project..."));

    const detectedSetup = detectProjectSetup();
    const baseFolder = detectedSetup.hasSrc ? "src" : "";

    // Split module names and trim whitespace
    const modules = moduleNames
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name);

    if (modules.length === 0) {
      console.log(chalk.red("Error: No valid module names provided."));
      return;
    }

    for (const moduleName of modules) {
      console.log(chalk.blue(`Adding '${moduleName}' module...`));

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
            ? `Enter additional sub-route names for '${moduleName}' (comma-separated, e.g., profile):`
            : `Enter sub-route names for '${moduleName}' (comma-separated, e.g., login, register):`,
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
        console.log(
          chalk.red(`Error: No valid sub-route names for '${moduleName}'.`)
        );
        continue;
      }

      // Create module folder
      if (!fs.existsSync(path.join(process.cwd(), folderPath))) {
        shell.mkdir("-p", path.join(process.cwd(), folderPath));
        console.log(chalk.green(`Created: ${folderPath}`));
      }

      // Define templates for auth module
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

      // Generate sub-routes
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

        // Use templates for auth module routes if available, else use a default template
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

      // Handle API routes if --with-api is passed
      if (options.withApi) {
        const apiDir = `${baseFolder}/${
          detectedSetup.routerType === "App Router" ? "app/api" : "pages/api"
        }/${moduleName}`;

        if (!fs.existsSync(apiDir)) {
          shell.mkdir("-p", apiDir);
          console.log(chalk.green(`Created API directory: ${apiDir}`));
        }

        subRouteNames.forEach((route) => {
          const apiPath = `${apiDir}/${route}.ts`;
          if (!fs.existsSync(apiPath)) {
            const apiContent = `// API handler for ${route}\n\nexport default function handler(req, res) {\n  if (req.method === "POST") {\n    res.status(200).json({ message: "${capitalizeFirstLetter(
              route
            )} successful!" });\n  } else {\n    res.status(405).json({ error: "Method not allowed" });\n  }\n}`;
            fs.writeFileSync(apiPath, apiContent);
            console.log(chalk.green(`Created: ${apiPath}`));
          } else {
            console.log(chalk.yellow(`Skipped: ${apiPath} (already exists)`));
          }
        });
      }

      // Handle Redux slice if --with-redux is passed
      if (options.withRedux) {
        const sliceDir = `${baseFolder}/store/slices`;

        if (!fs.existsSync(sliceDir)) {
          shell.mkdir("-p", sliceDir);
          console.log(chalk.green(`Created: ${sliceDir}`));
        }

        const slicePath = `${sliceDir}/${moduleName}Slice.ts`;
        if (!fs.existsSync(slicePath)) {
          const sliceContent = `import { createSlice } from "@reduxjs/toolkit";\n\nconst initialState = {};\n\nconst ${moduleName}Slice = createSlice({\n  name: "${moduleName}",\n  initialState,\n  reducers: {},\n});\n\nexport const {} = ${moduleName}Slice.actions;\nexport default ${moduleName}Slice.reducer;\n`;
          fs.writeFileSync(slicePath, sliceContent);
          console.log(chalk.green(`Created: ${slicePath}`));
        } else {
          console.log(chalk.yellow(`Skipped: ${slicePath} (already exists)`));
        }
      }

      console.log(
        chalk.blue(
          `Module '${moduleName}' has been added with sub-routes: ${subRouteNames.join(
            ", "
          )}`
        )
      );
    }
  });

// Add Environment Variables Management
program
  .command("add-env")
  .description(
    "Add or manage environment variables for different environments (e.g., development, production)"
  )
  .action(async () => {
    console.log(chalk.blue("Managing environment variables..."));

    // Prompt user to choose or specify the environment
    const { envType } = await inquirer.prompt([
      {
        type: "list",
        name: "envType",
        message: "Select the environment:",
        choices: [
          { name: "Default (.env)", value: ".env" },
          { name: "Development (.env.development)", value: ".env.development" },
          { name: "Production (.env.production)", value: ".env.production" },
          { name: "Custom (e.g., .env.staging)", value: "custom" },
        ],
      },
    ]);

    let envFilePath = "";
    if (envType === "custom") {
      const { customEnvFile } = await inquirer.prompt([
        {
          type: "input",
          name: "customEnvFile",
          message:
            "Enter the custom environment file name (e.g., .env.staging):",
          validate: (input) =>
            input.trim() !== "" ||
            "Custom environment file name cannot be empty!",
        },
      ]);
      envFilePath = path.join(process.cwd(), customEnvFile);
    } else {
      envFilePath = path.join(process.cwd(), envType);
    }

    // Check if the environment file exists
    if (fs.existsSync(envFilePath)) {
      console.log(chalk.yellow(`${envFilePath} already exists.`));
      const { shouldAppend } = await inquirer.prompt([
        {
          type: "confirm",
          name: "shouldAppend",
          message: `Would you like to add new environment variables to the existing ${envFilePath} file?`,
        },
      ]);

      if (!shouldAppend) {
        console.log(chalk.green(`No changes made to ${envFilePath}.`));
        return;
      }
    } else {
      console.log(chalk.green(`Creating a new ${envFilePath} file...`));
      fs.writeFileSync(envFilePath, `# ${envType} Environment Variables\n`);
    }

    // Prompt user for environment variables
    const { envVariables } = await inquirer.prompt([
      {
        type: "input",
        name: "envVariables",
        message: `Enter environment variables (key=value), separated by commas for ${envFilePath}:`,
        validate: (input) =>
          input.trim()
            ? true
            : "Please provide at least one environment variable.",
      },
    ]);

    // Parse and write environment variables
    const variables = envVariables.split(",").map((pair) => pair.trim());
    const formattedVariables = variables.map((v) => `${v}\n`).join("");

    fs.appendFileSync(envFilePath, formattedVariables);

    console.log(
      chalk.green(`Environment variables added to ${envFilePath}:\n`)
    );
    console.log(chalk.blue(formattedVariables));
  });

program
  .command("add-component")
  .description("Generate a modular React component")
  .option("--name <name>", "Name of the component")
  .option("--dir <dir>", "Target directory under components")
  .option("--with-tests", "Generate a test file", false)
  .action(async (options) => {
    const baseFolder = fs.existsSync("src") ? "src/components" : "components";

    if (!fs.existsSync(baseFolder)) {
      console.log(chalk.red(`Error: ${baseFolder} folder does not exist.`));
      return;
    }

    // Directories in the components folder
    const directories = fs
      .readdirSync(baseFolder, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // Use flags or prompts for directory and name
    const selectedDirectory =
      options.dir ||
      (
        await inquirer.prompt([
          {
            type: "list",
            name: "targetDirectory",
            message: "Select the directory for your component:",
            choices: [...directories, "Create new directory"],
          },
        ])
      ).targetDirectory;

    if (selectedDirectory === "Create new directory") {
      const { newDirectory } = await inquirer.prompt([
        {
          type: "input",
          name: "newDirectory",
          message: "Enter the name of the new directory:",
          validate: (input) =>
            input.trim() !== "" || "Directory name cannot be empty!",
        },
      ]);

      options.dir = newDirectory;
      const newDirPath = path.join(baseFolder, newDirectory);
      if (!fs.existsSync(newDirPath)) {
        shell.mkdir("-p", newDirPath);
        console.log(chalk.green(`Created new directory: ${newDirectory}`));
      }
    }

    const componentName =
      options.name ||
      (
        await inquirer.prompt([
          {
            type: "input",
            name: "componentName",
            message: "Enter the component name:",
            validate: (input) =>
              input.trim() !== "" || "Component name cannot be empty!",
          },
        ])
      ).componentName;

    const componentDir = path.join(
      baseFolder,
      options.dir || "",
      componentName
    );

    if (!fs.existsSync(componentDir)) {
      shell.mkdir("-p", componentDir);

      // Create the .tsx file
      const tsxContent = `// TODO: Customize this component\n\nimport styles from "./${componentName}.module.css";\n\nexport default function ${componentName}() {\n  return <div className={styles.${componentName.toLowerCase()}}>${componentName} Component</div>;\n}`;
      fs.writeFileSync(
        path.join(componentDir, `${componentName}.tsx`),
        tsxContent
      );

      // Create the CSS module file
      const cssContent = `/* Styles for ${componentName} Component */\n\n.${componentName.toLowerCase()} {\n  background-color: #f4f4f4;\n  padding: 16px;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n}`;
      fs.writeFileSync(
        path.join(componentDir, `${componentName}.module.css`),
        cssContent
      );

      // Create a test file if requested
      if (options.withTests) {
        const testContent = `import { render } from "@testing-library/react";\nimport ${componentName} from "./${componentName}";\n\ntest("renders ${componentName} component", () => {\n  const { getByText } = render(<${componentName} />);\n  expect(getByText("${componentName} Component")).toBeInTheDocument();\n});`;
        fs.writeFileSync(
          path.join(componentDir, `${componentName}.test.tsx`),
          testContent
        );
        console.log(
          chalk.green(`Created test file: ${componentName}.test.tsx`)
        );
      }

      console.log(
        chalk.green(
          `Component ${componentName} created successfully in ${
            options.dir || ""
          } directory!`
        )
      );
    } else {
      console.log(
        chalk.yellow(
          `Component ${componentName} already exists in ${
            options.dir || ""
          } directory.`
        )
      );
    }
  });

//Adding tailwind setup
program
  .command("add-tailwind")
  .description("Set up Tailwind CSS for your Next.js project")
  .action(async () => {
    console.log(chalk.blue("Setting up Tailwind CSS..."));

    const baseFolder = fs.existsSync("src") ? "src" : "";
    const stylesDir = path.join(process.cwd(), `${baseFolder}/styles`);
    const globalCSS = path.join(stylesDir, "globals.css");

    // Detect existing Tailwind configuration
    if (fs.existsSync("tailwind.config.js")) {
      const { shouldContinue } = await inquirer.prompt([
        {
          type: "confirm",
          name: "shouldContinue",
          message:
            "Tailwind CSS is already configured. Do you want to reconfigure it?",
          default: false,
        },
      ]);

      if (!shouldContinue) {
        console.log(chalk.green("Skipped Tailwind CSS setup."));
        return;
      }
    }

    // Install dependencies
    console.log(chalk.blue("Installing Tailwind CSS dependencies..."));
    const installCommand = fs.existsSync("yarn.lock")
      ? "yarn add"
      : "npm install";
    const dependencies = ["tailwindcss", "postcss", "autoprefixer"];
    shell.exec(`${installCommand} -D ${dependencies.join(" ")}`);

    // Initialize Tailwind CSS configuration
    console.log(chalk.blue("Initializing Tailwind CSS configuration..."));
    shell.exec("npx tailwindcss init -p");

    // Update tailwind.config.js
    const tailwindConfig = path.join(process.cwd(), "tailwind.config.js");
    const contentPaths = [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ];
    if (fs.existsSync(`${baseFolder}/app`)) {
      contentPaths.push(`./${baseFolder}/app/**/*.{js,ts,jsx,tsx}`);
    }

    const tailwindConfigContent = `module.exports = {
  content: ${JSON.stringify(contentPaths, null, 2)},
  theme: {
    extend: {},
  },
  plugins: [],
};`;

    fs.writeFileSync(tailwindConfig, tailwindConfigContent);
    console.log(chalk.green("Updated: tailwind.config.js"));

    // Ensure styles directory exists
    if (!fs.existsSync(stylesDir)) {
      shell.mkdir("-p", stylesDir);
      console.log(chalk.green(`Created: ${stylesDir}`));
    }

    // Add Tailwind directives to globals.css
    if (!fs.existsSync(globalCSS)) {
      fs.writeFileSync(
        globalCSS,
        `@tailwind base;\n@tailwind components;\n@tailwind utilities;`
      );
      console.log(chalk.green(`Created: ${globalCSS}`));
    } else {
      console.log(
        chalk.yellow(`${globalCSS} already exists. Skipping file creation.`)
      );
    }

    // Optional Prettier Plugin Setup
    const { installPrettierPlugin } = await inquirer.prompt([
      {
        type: "confirm",
        name: "installPrettierPlugin",
        message:
          "Would you like to install prettier-plugin-tailwindcss for class sorting?",
        default: true,
      },
    ]);

    if (installPrettierPlugin) {
      shell.exec(`${installCommand} -D prettier-plugin-tailwindcss`);
      console.log(chalk.green("Installed: prettier-plugin-tailwindcss"));
    }

    console.log(chalk.green("Tailwind CSS setup completed successfully!"));
  });

program.parse(process.argv);
