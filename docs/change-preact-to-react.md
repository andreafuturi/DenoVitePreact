# Change Preact to React

## Introduction

This document provides instructions on how to switch from Preact to React in your project. Preact is a lightweight alternative to React, but there may be cases where you need to use React for its additional features and compatibility.

## Table of Contents

1. [Remove Preact Configuration](#remove-preact-configuration)
2. [Update Vite Configuration](#update-vite-configuration)
3. [Replace Preact with React](#replace-preact-with-react)
4. [Update Render and Hydrate Functions](#update-render-and-hydrate-functions)

## Remove Preact Configuration

1. Delete the `deno.json` file from the `server` directory. This file contains the Preact configuration and is no longer needed.

## Update Vite Configuration

1. Open the `vite.config.js` file in the `client` directory.
2. Remove the Preact HMR plugin from the Vite configuration.

```javascript
import { defineConfig } from "vite";
// import preact from "@preact/preset-vite";

export default defineConfig({
  // plugins: [preact()],
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  server: {
    port: 3456,
  },
});
```

## Replace Preact with React

1. Replace all instances of Preact imports with React imports in your project files. For example, replace:

```javascript
import { h } from "https://esm.sh/preact";
```

with:

```javascript
import React from "https://esm.sh/react";
```

2. Update any other Preact-specific imports to their React equivalents.

## Update Render and Hydrate Functions

1. Replace the Preact `render` and `hydrate` functions with the React versions in your project files. For example, replace:

```javascript
import { render } from "https://esm.sh/preact-render-to-string?deps=preact";
import { hydrate } from "https://esm.sh/preact";
```

with:

```javascript
import { renderToString } from "https://esm.sh/react-dom/server";
import { hydrate } from "https://esm.sh/react-dom";
```

2. Update any other Preact-specific functions to their React equivalents.

By following these steps, you can successfully switch your project from Preact to React.
