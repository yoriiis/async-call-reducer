# asyncCallReducer

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/yoriiis/async-call-reducer/Build/main?style=for-the-badge) [![Coverage Status](https://img.shields.io/coveralls/github/yoriiis/async-call-reducer?style=for-the-badge)](https://coveralls.io/github/yoriiis/async-call-reducer?branch=main)

The `asyncCallReducer` is a function to reduce calls using browser storage. A Promise can be encapsulated, a single HTTP request will be triggered regardless of the number of calls. Concurrent calls are added on a queue and return's data are stored in the browser.

Rules:

- The first call is granted
- Concurrent calls are blocked and added on a queue, then execute when the first call is ready
- Next calls get the data from the browser storage

## Installation

The function is available as the `async-call-reducer` package name on [npm](https://www.npmjs.com/package/async-call-reducer) and [Github](https://github.com/yoriiis/async-call-reducer).

```bash
npm i --save-dev async-call-reducer
```

```bash
yarn add --dev async-call-reducer
```

## Environment

`asyncCallReducer` was built for Node.js `>=12`.

## Demo

The project includes an example of an implementation of `asyncCallReducer` in the directory `./demo/`.

## Usage

Imagine the following function to get data from an API. Each call will trigger an HTTP request.

```javascript
async function getData() {
  const data = await fetch('https://swapi.dev/api/people/?page=1');
  return await data.json();
}
```

By wrapping the function with the `asyncCallReducer`, a single HTTP request will be triggered. Other calls will return exactly the same value, either from the storage or from the queue if the calls was concurrent.

```diff
async function getData() {
+   return await asyncCallReducer({
+       key: 'swapi',
+       callback: async () => {
            const data = await fetch('https://swapi.dev/api/people/?page=1');
            return await data.json();
+        }
+    });
}
```

## Parameters

### `key`

`string = asyncCallReducer`

Tells to the function the storage key used as a prefix. Following keys will be created:

- `asyncCallReducerData`: Stored data
- `asyncCallReducerLoading`: Blocker for concurrent calls

```js
asyncCallReducer({
  key: 'swapi'
});
```

### `storage`

`string = sessionStorage`

Tells to the function which browser storage method to use (`sessionStorage|localStorage`).

```js
asyncCallReducer({
  storage: 'localStorage'
});
```

### `callback`

`Promise`

Tells the function the promise to be executed.

```js
asyncCallReducer({
  callback: async () => {}
});
```

## Licence

`asyncCallReducer` is licensed under the [MIT License](http://opensource.org/licenses/MIT).

Created with ♥ by [@yoriiis](http://github.com/yoriiis).
