# Project Maintenance Guide

This document is intended for developers and maintainers of the EUDI Wallet application. It covers the project's architecture, directory structure, and build processes.

## 1. Architecture Overview

This project is a **Service Worker-Enhanced Multi-Page Application (MPA)**.

- **HTML-First**: Logic works by "sprinkling" behavior onto physical HTML pages.
- **Offline-First**: A Service Worker precaches all assets, ensuring the app works without a network connection.
- **No SPA Framework**: We do NOT use React, Vue, or Angular.
    - **Logic**: Handled by **Alpine.js** (lightweight reactivity).
    - **Layout**: Handled by standard **Web Components** (`src/components/`).
    - **Routing**: Handled by the browser (standard links) and intercepting **Service Worker**.
- **Build Tool**: **Vite** is used to bundle assets, hash filenames, and generate the Service Worker manifest.

## 2. Directory Structure

```text
/
├── src/
│   ├── components/       # Reusable Web Components (e.g., app-header.js)
│   │                     # These are Custom Elements, NOT framework components.
│   │
│   ├── lib/              # Pure JavaScript logic 
│   │   ├── crypto/       # Cryptographic operations
│   │   └── ...           # Domain business logic
│   │
│   ├── pages/            # Physical HTML Entry Points
│   │   ├── index.html    # Home page
│   │   ├── credentials/  # Feature-specific pages
│   │   └── ...
│   │
│   ├── styles/           # Modular CSS System
│   │   ├── variables.css # Design Tokens (Colors, Spacing) - Source of Truth
│   │   ├── main.css      # Main entry point importing other CSS files
│   │   └── ...
│   │
│   ├── app.js            # Main Application Entry
│   │                     # - Initializes Alpine.js
│   │                     # - Registers the Service Worker
│   │
│   ├── sw.js             # Service Worker Source
│   │                     # - Defines caching strategy (Cache-First)
│   │                     # - Receives injected manifest from build
│   │
│   └── types/            # TypeScript Definitions (JSDoc support)
│                         # - globals.d.ts: Defines 'Alpine' and 'sw' types
│
├── public/               # Static assets (images, icons, manifest.json)
├── dist/                 # Production Build Output (Git-ignored)
├── vite.config.js        # Build Configuration (MPA & PWA plugins)
├── jsconfig.json         # Editor Type Hinting Config
└── package.json          # Dependency Management
```

## 3. Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- BPM (Browser Package Manager) or `npm`

### Installation
Clone the repository and install dependencies:
```bash
npm install
```

### Development
Start the local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open the provided localhost URL. Note that Service Worker caching behavior might be relaxed in dev mode depending on browser settings, but the architecture remains the same.

## 4. Build Process

The project uses Vite to produce a production-ready build.

```bash
npm run build
```

**What happens during build:**
1.  **Asset Bundling**: JS and CSS are bundled and minified. Filenames are hashed for long-term caching (e.g., `index.a1b2.js`).
2.  **HTML Processing**: References in HTML files are updated to point to the new hashed assets.
3.  **PWA Generation**: `vite-plugin-pwa` scans the output `dist/` folder and injects the list of ALL generated files into `dist/sw.js`.

### Service Worker & Caching
The source `src/sw.js` contains a placeholder:
```javascript
const INJECTED_ASSETS = self.__WB_MANIFEST;
```
During the build, this is replaced with the actual file list. This ensures the Service Worker always knows exactly which files to pre-cache.

## 5. Key Configuration Files

- **`vite.config.js`**:
    - `build.rollupOptions.input`: Defines the MPA entry points. **If you add a new HTML page, you MUST add it here** for it to be included in the build.
    - `VitePWA`: Configures the Service Worker generation using the `injectManifest` strategy.

- **`jsconfig.json`**:
    - Configures VS Code / Editor to provide type safety using JSDoc.
    - Includes `webworker` and `dom` libraries.

- **`src/types/globals.d.ts`**:
    - Manual type overrides (e.g., typing `window.Alpine`).

## 6. How to Add a New Page

1.  Create the HTML file (e.g., `src/pages/about.html`).
2.  Add it to `vite.config.js` inputs:
    ```javascript
    input: {
      // ...
      about: resolve(__dirname, 'src/pages/about.html'),
    }
    ```
3.  Run `npm run build` to verify inclusion.
