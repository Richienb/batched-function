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

How long to wait in milliseconds before calling the function. If `undefined`, which is by default, the function is called in the next [microtask](https://javascript.info/microtask-queue).
