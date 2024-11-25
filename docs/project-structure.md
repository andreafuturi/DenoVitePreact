# Project Structure

This document provides an overview of the project structure for the Singularity framework. It explains the purpose of each directory and file within the project to help you understand how the framework is organized.

## Table of Contents

- [Server](#server)
- [Client](#client)
- [Minimal Project Structure](#minimal-project-structure)

## Server

The structure separates server and client code for clarity.

### /server

- **main.jsx**: Entry point for the server-side application.
- **api/**: API routes, automatically served at `/api/`
- **deno.json**: Server configuration file (only needed if you want to use Preact).

  _Add any additional server logic files here._

## Client

### /client

- **main.jsx**: Front-end entry point for client-side hydration and router initialization. (imported with MainJsx component)
- **index.jsx**: Main HTML content; editable with Preact components to customize `<head>`, etc. Automatically used as wrapper for routes (must accept a children)
- **index.css**: Global styles, automatically included in `index.jsx` (imported with IndexCss component).
- **home/home.jsx**: Main route automatically served at `/` or `/home`.
- **about.jsx**: Another route example automatically served at `/about`.
- **components**: Folder for components and their relative CSS/JS modules.
- **vite.config.js**: Client configuration file for Vite's Preact HMR.

  _Add client-side files (e.g., front-end functions, UI components, or static files) here._

## Minimal Project Structure

For a simple setup, structure the project as:

- `client/index.jsx`: JSX landing page
- `server/main.jsx`: Serves `index.jsx` at each request
- `server/deno.json`: Optional Preact config (you can also use React instead)
- `client/vite.config.js`: Basic Vite configuration

To add interactivity

- `client/main.jsx`: Hydrates interactive components (import in `index.jsx` with the MainJsx component)
