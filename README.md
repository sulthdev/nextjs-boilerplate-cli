# 🚀 nextjs-boilerplate-cli (beta)

**A CLI tool to enhance and structure your TypeScript-based Next.js projects.**  
📌 _Currently, this CLI only supports TypeScript Next.js projects._  
📌 _You may need to adjust the structure or code based on your project requirements._

---

## 📦 Installation

Install the CLI globally using `npm`:

```bash
npm install -g nextjs-boilerplate-cli
```

---

## 🛠️ Commands

### 1. Add Boilerplate

Enhance an existing Next.js project with a basic boilerplate structure:

```bash
boilerplate-cli add
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
boilerplate-cli add-redux
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
boilerplate-cli add-module
```

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

## 📦 Features

- Automatic folder structure creation for both `App Router` and `Pages Router`.
- Supports Redux Toolkit setup with customizable slices.
- Flexible module creation with predefined templates (e.g., `auth` with `login` and `register`).
- Installs required dependencies like `axios`, `react-redux`, and `@reduxjs/toolkit`.

---

## 🔧 Requirements

- Node.js >= 14
- Next.js with TypeScript setup
- Existing Next.js project directory (`package.json` must exist)

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

---
