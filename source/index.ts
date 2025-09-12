export type Options = {
	/**
	How long to wait in milliseconds before calling the function. If `undefined`, which is by default, the function is called in the next [microtask](https://javascript.info/microtask-queue).

	If `function_` returns a promise, the next batch will run after whichever of the delay or promise takes longer.

	@type number
	*/
	delay?: number;
};

async function delay_(ms: number): Promise<void> {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

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
export default function batchedFunction<ValueType>(function_: (value: ValueType[]) => unknown, {delay = undefined}: Options = {}): (value: ValueType) => void {
	if (typeof delay !== 'number' && delay !== undefined) {
		throw new TypeError(`Expected \`interval\` to be of type \`number\` but received type \`${typeof delay}\``);
	}

	let queue: ValueType[] = [];
	let isRunning = false;

	return value => {
		queue.push(value);

		if (isRunning) {
			return;
		}

		isRunning = true;

		(async () => {
			if (delay !== undefined) {
				await delay_(delay);
			}

			do {
				/* eslint-disable no-await-in-loop */
				const oldQueue = queue;

				// Values must not be removed from the original queue array because the function might still be using them.
				queue = [];

				let promise = function_(oldQueue);

				if (delay !== undefined) {
					promise = Promise.all([
						promise,
						delay_(delay),
					]);
				}

				await promise;
				/* eslint-enable no-await-in-loop */
			} while (queue.length > 0);

			isRunning = false;
		})();
	};
}
