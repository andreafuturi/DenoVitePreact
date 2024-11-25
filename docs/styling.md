# Styling

## Introduction

This document provides an overview of the styling mechanism in the Singularity framework. It explains how to use the `Import` tag to include CSS files in your application.

## Table of Contents

- [Using the Import Tag for CSS](#using-the-import-tag-for-css)
- [Scoped Styling](#scoped-styling)

## Using the Import Tag for CSS

The `Import` tag can be used to import CSS files that will be included in the final HTML page as inline style tags. This helps in keeping the styles modular and scoped to specific components.

Example:

```jsx
{inlineImport({ src: "counter.css" })}
Component content
```

The CSS file will be included once per render and will not be hydrated by the client, as it does not have any interactivity.

## Scoped Styling

The imported CSS files are not CSS modules, so you need to use normal CSS syntax techniques like nesting for scoping. This ensures that the styles are applied only to the intended elements.

Example:

```css
.counter {
  p {
    color: red;
    /* this will be a scoped style */
  }
}
```
