# Repository Guidelines

## Instructions

-  every code modification should be stored in Temp.js instead of modifying the actual files
-  always follow the app theme
-  never make full modifications. just the required ones
-  always know the full structure of the project to have proper knowledge of the routes

## Project Structure & Module Organization

-  app/: Main application source code for the Expo React Native app
   -  app/index.jsx: App entry that wires providers and navigation
   -  app/components/: Reusable UI components (e.g., PartCard.jsx, Toast.jsx)
   -  app/screens/: Screen-level views (e.g., HomeScreen.jsx, ProductCatalogScreen.jsx)
   -  app/navigation/: Navigators (StackNavigator.jsx, TabNavigator.jsx)
   -  app/context/: React context providers (AuthContext.jsx, ThemeContext.jsx, ToastContext.jsx)
   -  app/services/: API layer (api.js)
   -  app/constants/: Global constants (theme.js)
   -  app/utils/: Utilities (comfortUtils.js, common.js)
-  assets/: App icons and splash assets referenced by Expo (icon.png, splash-icon.png)
-  app.json: Expo application configuration
-  eas.json: EAS build profiles
-  package.json: Scripts and dependencies
-  .env.development / .env.production: Environment configuration for Expo (public vars)

## Build, Test, and Development Commands

```bash
# Start the Expo dev server (interactive platform chooser)
yarn start

# Start on a specific platform
yarn android
# yarn ios
# yarn web

# EAS build (profiles defined in eas.json)
# Development client build
yarn expo build --profile development   # or: npx expo run with EAS CLI configured
```

Scripts come from package.json and map to expo start flags.

## Coding Style & Naming Conventions

-  Indentation: 2 spaces
-  File naming: PascalCase for React components (e.g., PartCard.jsx), camelCase for utilities (comfortUtils.js), kebab-case not used
-  Function/variable naming: camelCase for JS; components in PascalCase
-  Linting/formatting: No explicit config found; follow Prettier-like 2-space style and React/JS best practices

## Testing Guidelines

-  Framework: No explicit testing setup found (no jest/mocha config or test scripts)
-  Test files: Not present
-  Running tests: Not configured
-  Coverage: Not specified

## Commit & Pull Request Guidelines

-  Commit format observed: concise single-word "DONE" messages in git history
   -  Example: fe22db1f – DONE
-  PR process and branch naming: Not documented in repo; propose feature/<short-desc> or fix/<short-desc> (team to align)

---

# Repository Tour

## 🎯 What This Repository Does

ComPORT is a React Native (Expo) application that helps users browse PC parts/products, build bundles, review items, and assess comfort/compatibility via an API and ML-backed endpoints.

Key responsibilities:

-  Product catalog browsing and product detail views
-  Bundle creation, update, and review workflows
-  Integrations to backend API including comfort/ML endpoints

---

## 🏗️ Architecture Overview

This is a client-side mobile/web app built with Expo and React Native. Navigation is handled by custom Stack/Tab navigators. State and cross-cutting concerns use React Context providers. Remote data is accessed through a thin axios-based service layer that respects Expo environment configuration.

### System Context

```
[User (Expo app)] → [ComPORT (React Native)] → [Backend API (EXPO_PUBLIC_API_URL)]
                                         ↓
                                 [ML Endpoints under /ml/*]
```

### Key Components

-  Navigation (app/navigation): Defines app flow via StackNavigator and TabNavigator
-  Screens (app/screens): Feature screens for catalog, bundle builder, auth, profile
-  Services (app/services/api.js): Axios client with environment-aware baseURL; exports typed API calls
-  Context (app/context/\*): Theme, Auth, and Toast providers used across the app
-  Components (app/components/\*): Reusable UI units (cards, rows, modals)
-  Utils (app/utils/\*): Cross-cutting utilities including comfort-related helpers

### Data Flow

1. User interacts with a screen (e.g., ProductCatalogScreen.jsx)
2. Screen triggers a service call (e.g., getProducts) via app/services/api.js
3. api.js resolves baseURL from Expo env/Constants and calls backend endpoints
4. Response data populates screen state; components render results

---

## 📁 Project Structure [Partial Directory Tree]

```
ComPORT_Main/
├─ app/
│  ├─ index.jsx
│  ├─ components/
│  ├─ screens/
│  ├─ navigation/
│  ├─ context/
│  ├─ services/
│  ├─ constants/
│  └─ utils/
├─ assets/
├─ app.json
├─ eas.json
├─ package.json
├─ .env.development
└─ .env.production
```

### Key Files to Know

| File                                 | Purpose                                   | When You'd Touch It                                   |
| ------------------------------------ | ----------------------------------------- | ----------------------------------------------------- |
| app/index.jsx                        | App entry; wires providers and navigators | Add global providers or bootstrap logic               |
| app/navigation/StackNavigator.jsx    | Stack navigation                          | Adjust screen stack and transitions                   |
| app/navigation/TabNavigator.jsx      | Bottom tabs                               | Change tab layout or routes                           |
| app/screens/ProductCatalogScreen.jsx | Catalog UI/logic                          | Implement filtering, pagination, calls to getProducts |
| app/screens/PartDetailScreen.jsx     | Detail UI/logic                           | Load product details with getProduct                  |
| app/screens/BundleBuilderScreen.jsx  | Build bundles                             | Integrate createBundle and comfort scoring            |
| app/services/api.js                  | Axios client and API methods              | Add/modify API endpoints                              |
| app/context/AuthContext.jsx          | Auth state handling                       | Update auth flows or token handling                   |
| app/context/ThemeContext.jsx         | Theming                                   | Adjust theme tokens or dark mode                      |
| app/constants/theme.js               | Theme variables                           | Update color and spacing tokens                       |
| app/utils/comfortUtils.js            | Utilities                                 | Update comfort-related calculations                   |
| app.json                             | Expo config (icons, plugins)              | Change app metadata or plugins                        |
| eas.json                             | EAS build profiles                        | Modify CI build behavior                              |
| .env.\*                              | Public env vars for Expo                  | Update API URLs and public keys                       |

---

## 🔧 Technology Stack

### Core Technologies

-  Language: JavaScript/JSX
-  Framework: React Native via Expo (~54) with expo-router entry; React 19, React Native 0.81.4
-  Backend: External REST API configured via EXPO_PUBLIC_API_URL
-  Navigation: @react-navigation (via NavigationContainer in index.jsx) and custom navigators

### Key Libraries

-  axios: HTTP client for backend integration
-  react-native-paper: UI components library
-  expo-\* packages: platform services (fonts, linking, navigation bar, secure store, status bar)
-  react-native-gesture-handler, react-native-reanimated, react-native-screens: Navigation/gesture stack

### Development Tools

-  Expo CLI (expo start)
-  EAS (eas.json profiles: development, preview, production)

---

## 🌐 External Dependencies

-  Backend API: EXPO_PUBLIC_API_URL (development points to local :6600; production to https://comport-server.onrender.com/api)
-  ML Endpoints: /ml/status, /ml/comfort/bundle, /ml/comfort/product/:id (served by the backend)

### Environment Variables

```bash
# Required (public for Expo)
EXPO_PUBLIC_API_URL=   # Backend base URL (e.g., http://localhost:6600/api)
EXPO_PUBLIC_TOKEN_KEY= # Token storage key (e.g., comport_token)
```

---

## 🔄 Common Workflows

### Catalog and Details

-  Code path: app/screens/ProductCatalogScreen.jsx → app/services/api.js(getProducts)
-  Details: app/screens/PartDetailScreen.jsx → app/services/api.js(getProduct)

### Bundle Builder and Comfort Scoring

-  Code path: app/screens/BundleBuilderScreen.jsx → app/services/api.js(createBundle, getBundleComfortRating)

### Reviews

-  Code path: app/components/ReviewSubmission.jsx → app/services/api.js(createReview, getReviews)

---

## 📈 Performance & Scale

-  Network: api.js centralizes axios instance; consider request caching or pagination strategies in screens
-  Logging: LogBox.ignoreAllLogs(true) suppresses RN warnings in app/index.jsx; adjust for debugging

---

## 🚨 Things to Be Careful About

### Security Considerations

-  Only EXPO*PUBLIC*\* env vars are embedded at build time; avoid secrets in these files
-  Token handling should use Secure Store when implemented (expo-secure-store is installed)
-  Be mindful of backend rate limits and error handling; api.js normalizes error responses

Update to last commit: fe22db1f61f78d1fa6289acdb2788f87d338e4c5
