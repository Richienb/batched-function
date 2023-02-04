export type Options = {
	/**
	Interval in milliseconds to wait before calling the function with the values.

	@type number
	@default 0
	*/
	interval?: number;
};

/**
Batch multiple function calls into a single one. After a value is passed, `function_` is called `interval` milliseconds later with an array of all the values passed in that time, including the first one.

@param function_ - Function to be called with the values.

@example
```
import batchedFunction from 'batched-function';

const batched = batchedFunction(values => {
	console.log(values);
});

batched('🦄');
batched('🌈');
batched('🐻');
// Logs ['🦄', '🌈', '🐻']
```
*/
export default function batchedFunction<ValueType>(function_: (value: ValueType[]) => unknown, {interval = 0}: Options = {}): (value: ValueType) => void {
	if (typeof interval !== 'number') {
		throw new TypeError(`Expected \`interval\` to be of type \`number\` but received type \`${typeof interval}\``);
	}

	let queue: ValueType[] = [];

	return value => {
		queue.push(value);

		if (queue.length === 1) {
			setTimeout(() => {
				function_(queue);

				// Values must not be removed from the original queue array because the function might still be using them.
				queue = [];
			}, interval);
		}
	};
}
