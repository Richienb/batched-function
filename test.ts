import test from 'ava';
import pDefer from 'p-defer';
import timeSpan from 'time-span';
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

test('delay', async t => {
	const {promise, resolve} = pDefer();

	const batched = batchedFunction(values => {
		resolve(values);
	}, {
		delay: 500,
	});

	batched('🦄');
	batched('🌈');
	batched('🐻');

	const end = timeSpan();

	t.deepEqual(await promise, ['🦄', '🌈', '🐻']);

	// TODO: Make this test more robust to random timing errors (which could cause a test run to fail)
	t.true(end() >= 500);
});
