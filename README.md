# 🚀 nextjs-boilerplate-cli (beta)

**A CLI tool to enhance and structure your TypeScript-based Next.js projects.**  
📌 _Currently, this CLI only supports TypeScript Next.js projects._  
📌 _You may need to adjust the structure or code based on your project requirements._

---

## 📦 Installation

You can use `nextjs-boilerplate-cli` directly via `npx` or install it globally.

### **Option 1: Quick Start with `npx` (Recommended)**

Run the CLI directly using `npx` without any installation:

```bash
npx nextjs-boilerplate-cli
```

This ensures you always use the latest version of the CLI. No installation required!

**Usage:**

1. Navigate to your Next.js project directory:

   ```bash
   cd your-nextjs-project
   ```

2. Execute the CLI:

   ```bash
   npx nextjs-boilerplate-cli add
   ```

### **Option 2: Install Globally**

If you prefer to install the CLI globally for repeated use:

```bash
npm install -g nextjs-boilerplate-cli
```

Once installed globally, you can run the CLI using:

```bash
nextjs-boilerplate add
```

**Note:**  
If you've previously installed `nextjs-boilerplate-cli` globally and want to switch to using `npx`, you can uninstall the global version using:

```bash
npm uninstall -g nextjs-boilerplate-cli
```

---

## 🚀 Quick Start

Follow these steps to get started quickly:

1. Navigate to your existing Next.js project:

   ```bash
   cd your-nextjs-project
   ```

2. Run the CLI:

   - Using `npx`:

     ```bash
     npx nextjs-boilerplate-cli add
     ```

   - Or, if installed globally:

     ```bash
     nextjs-boilerplate add
     ```

3. Follow the interactive prompts.

4. Start coding with the enhanced structure! 🚀

---

## 🛠️ Commands

### 1. Add Boilerplate

Enhance an existing Next.js project with a basic boilerplate structure:

```bash
npx nextjs-boilerplate-cli add
# or, if installed globally
nextjs-boilerplate add
```

**What it does:**

- Creates a modular folder structure based on your router type (`App Router` or `Pages Router`).
- Includes templates for:
  - Layout (`layout.tsx`) or `_app.tsx`
  - Error pages (`error.tsx` or `_error.tsx`)
  - API setup (`api.ts`)
  - Global constants (`constants.ts`)

**Example Output:**

```plaintext
src/
  components/ui
  hooks/
  lib/
    api.ts
    constants.ts
  services/
  styles/
  types/
  utils/
```

---

### 2. Add Redux Toolkit

Add Redux Toolkit setup to your Next.js project:

```bash
npx nextjs-boilerplate-cli add-redux
```

**What it does:**

- Sets up a Redux store with a default `generalSlice`.
- Prompts you to add custom slices (optional).
- Updates the store dynamically to include all reducers.
- Outputs a helpful note for wrapping your app with the `Provider`.

**Example Output:**

```plaintext
src/
  store/
    slices/
      generalSlice.ts
      customSlice.ts (optional)
    index.ts
```

**Note:**  
Don't forget to wrap your app with the `Provider`!

_For App Router:_

```typescript
import { Provider } from "react-redux";
import { store } from "../store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
```

_For Pages Router:_

```typescript
import { Provider } from "react-redux";
import { store } from "../store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
```

---

### 3. Add Module

Add a new module with sub-routes:

```bash
npx nextjs-boilerplate-cli add-module <moduleNames>
```

**Options:**

- `--with-api`: Generate API routes for the modules.
- `--with-redux`: Generate Redux slices for the modules.

**What it does:**

- Prompts for the module name (e.g., `auth`, `dashboard`).
- Auto-generates predefined templates for `auth` (e.g., `login` and `register`).
- Allows you to define custom sub-routes for other modules.

**Example Output for `auth`:**

```plaintext
src/
  app/
    (auth)/
      login/
        page.tsx
      register/
        page.tsx
```

---

### 4. Add Environment Variables

Manage environment variables for different environments:

```bash
npx nextjs-boilerplate-cli add-env
```

**What it does:**

- Prompts to select or create an environment file (e.g., `.env`, `.env.production`).
- Allows you to append or create environment variables dynamically.

---

### 5. Add Component

Generate a modular React component:

```bash
npx nextjs-boilerplate-cli add-component --name <name> [--dir <dir>] [--with-tests]
```

**What it does:**

- Creates a new React component in the specified or selected directory.
- Optionally generates a CSS module and a test file.

**Example Output:**

```plaintext
src/
  components/
    MyComponent/
      MyComponent.tsx
      MyComponent.module.css
      MyComponent.test.tsx (optional)
```

---

### 6. Add Tailwind CSS

Set up Tailwind CSS for your Next.js project:

```bash
npx nextjs-boilerplate-cli add-tailwind
```

**What it does:**

- Installs Tailwind CSS, PostCSS, and Autoprefixer.
- Configures Tailwind CSS with the appropriate `content` paths.
- Updates or creates `globals.css` with Tailwind directives.
- Optionally installs `prettier-plugin-tailwindcss` for class sorting.

**Example Output:**

```plaintext
src/
  styles/
    globals.css
tailwind.config.js
postcss.config.js
```

---

## 📦 Features

- Automatic folder structure creation for both `App Router` and `Pages Router`.
- Supports Redux Toolkit setup with customizable slices.
- Flexible module creation with predefined templates (e.g., `auth` with `login` and `register`).
- Installs required dependencies like `axios`, `react-redux`, and `@reduxjs/toolkit`.
- Adds Tailwind CSS setup with optional Prettier plugin for class sorting.

---

## 🛠️ Example Project Structure

Here's an example of the folder structure created by this CLI:

```plaintext
src/
  components/ui
  hooks/
  lib/
    api.ts
    constants.ts
  services/
  styles/
  types/
  utils/
  store/
    slices/
      generalSlice.ts
      customSlice.ts (if added)
    index.ts
  app/
    (auth)/
      login/
        page.tsx
      register/
        page.tsx
  pages/ (if using Pages Router)
    _app.tsx
    _error.tsx
```

---

## 📝 Notes

- This CLI is specifically designed for **TypeScript Next.js projects**.
- You may need to adjust the generated structure or files according to your specific requirements.

---

## 🌟 Contribution

Feel free to fork and contribute to this project by opening a pull request.

---

## 📧 Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/sulthdev/nextjs-boilerplate-cli/issues).
