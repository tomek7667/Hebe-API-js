# hebe-api

Unofficial library for programmatic access to your Hebe account and your orders.

Python equivalent can be found at the [hebe-api pypi package](https://pypi.org/project/hebe-api/)

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
const { Hebe } = require("hebe-api");
// ESM module
import { Hebe } from "hebe-api";
```

## Usage

### Obtaining Hebe security token

```ts
const hebe = new Hebe({
    username: "HEBE_USERNAME",
    password: "HEBE_PASSWORD"
});
await hebe.authenticate();
console.log(hebe.token)
// T2a...................
```

You can also provide credentials later:

```ts
const hebe = new Hebe();
await hebe.authenticate({
    username: "HEBE_USERNAME",
    password: "HEBE_PASSWORD"
});
console.log(hebe.token)
// E9U...................
```

### Obtaining user orders

```ts
const orders = await hebe.getOrders({ maxOrders: 1 });
```

## 💻 Development

If you want to improve the package or you are just curious on how it works, follow this section.

### 🧾 Requirements

-   [node.js 18.x](https://nodejs.org/) *(but earlier will prob work too.)*
-   [npm](https://www.npmjs.com/) (or similar package manager)

#### Notable dev-dependencies

-   [typescript](https://www.typescriptlang.org/) to make programming decent
-   [jest.js](https://jestjs.io/) for unit tests

### 🔧 Development setup

Install the dependencies with

```bash
yarn
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
yarn test
```
