# batch-fn

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

##### interval

Type: `number`\
Default: `0`

Interval in milliseconds to wait before calling the function with the values.
