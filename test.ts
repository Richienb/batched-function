import test from 'ava';
import pDefer from 'p-defer';
import batchedFunction from './source/index.js';

test('main', async t => {
	const {promise, resolve} = pDefer();

	const batched = batchedFunction(values => {
		resolve(values);
	});

	batched('🦄');
	batched('🌈');
	batched('🐻');

	t.deepEqual(await promise, ['🦄', '🌈', '🐻']);
});
