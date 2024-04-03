# hebe-api

Unofficial library for programmatic access to your Hebe account and your orders

## ▶️ Use

Install the package

```bash
yarn add hebe-api
```

or

```bash
npm install hebe-api
```

## 📖 Getting Started

### Importing

Once it has been installed, it can easily be imported in your project, depending on the import method you need.

```js
// Common js module
const { Test } = require("hebe-api");
// ESM module
import { Test } from "hebe-api";
```

## Basic example

```js
// TODO
```

## 💻 Development

If you want to improve the package or you are just curious on how it works, follow this section.

### 🧾 Requirements

-   [node.js 14.x](https://nodejs.org/)
-   [npm](https://www.npmjs.com/) (or similar package manager)

#### Notable dev-dependencies

-   [typescript](https://www.typescriptlang.org/) to make programming decent
-   [rollup.js](https://rollupjs.org/guide/en/) for building the package
-   [mocha](https://mochajs.org/) for unit tests

### 🔧 Setup

Install the dependencies with

```bash
yarn
```

### 🌐 Standalone web server

To play around and see for yourself any changes to the library, you can use the integrated web server.
Just run

```bash
# Build the package locally and start the web server
npm run build:dev
npm start
# Allows live reload by refreshing the page
npm run start:dev
```

### 🧱 Build

Make sure everything is clean by running

```bash
yarn clean
```

then all the versions of the package can be built with the command

```bash
yarn build
```

### 🧪 Tests

#### Unit

After having installed the dependencies, run

```bash
yarn test:unit
```
