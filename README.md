# batched-function

> Batch multiple function calls into a single one

Useful for collecting DOM updates.

## Install

```sh
npm install batched-function
```

## Usage

```js
import batchedFunction from 'batched-function';

const batched = batchedFunction(values => {
	console.log(values);
});

batched('🦄');
batched('🌈');
batched('🐻');
// Logs ['🦄', '🌈', '🐻']
```

## API

### batchedFunction(function_, options?)

After a value is passed, `function_` is called `interval` milliseconds later with an array of all the values passed in that time, including the first one.

#### options

Type: `object`

##### delay

Type: `number`\
Default: `undefined`

Delay in milliseconds to wait before calling the function with the values. If `undefined`, which is by default, the function is called after [`Promise.resolve()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve).
