/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */
import {setTimeout as delay} from 'node:timers/promises';
import test, {type ExecutionContext} from 'ava';
import timeSpan from 'time-span';
import batchedFunction from './source/index.ts';

test('main', async (t: ExecutionContext) => {
	const receivedValues: string[][] = [];

	const batched = batchedFunction<string>(values => {
		receivedValues.push([...values]);
	});

	batched('🦄');
	batched('🌈');
	batched('🐻');

	await delay(100);

	t.deepEqual(receivedValues, [['🦄'], ['🌈', '🐻']]);
});

test('delay', async (t: ExecutionContext) => {
	const receivedValues: string[][] = [];

	const batched = batchedFunction<string>(values => {
		receivedValues.push([...values]);
	}, {
		delay: 500,
	});

	batched('🦄');
	batched('🌈');
	batched('🐻');

	const end = timeSpan();

	await delay(600);

	t.deepEqual(receivedValues, [['🦄', '🌈', '🐻']]);

	t.true(end() >= 490);
});

test('items added while still running', async (t: ExecutionContext) => {
	const receivedValues: string[][] = [];

	const batched = batchedFunction<string>(async values => {
		await delay(500);
		receivedValues.push([...values]);
	}, {
		delay: 500,
	});

	batched('🦄');
	batched('🌈');
	batched('🐻');

	await delay(600);

	batched('🍄');
	batched('🌰');

	await delay(2000);

	t.deepEqual(receivedValues, [['🦄', '🌈', '🐻'], ['🍄', '🌰']]);
});

test('next batch runs faster if function takes some time', async (t: ExecutionContext) => {
	const receivedValues: string[][] = [];

	const batched = batchedFunction<string>(async values => {
		await delay(500);
		receivedValues.push([...values]);
	}, {
		delay: 1000,
	});

	batched('🦄');
	batched('🌈');
	batched('🐻');

	// Starts running after 1000ms, finishes at 1500ms
	await delay(1700);

	batched('🍄');
	batched('🌰');

	// Next call is at 2000ms
	await delay(900);

	t.deepEqual(receivedValues, [['🦄', '🌈', '🐻'], ['🍄', '🌰']]);
});

test('next batch runs at normal speed if function finishes first', async (t: ExecutionContext) => {
	const receivedValues: string[][] = [];

	const batched = batchedFunction<string>(async values => {
		receivedValues.push([...values]);
	}, {
		delay: 500,
	});

	batched('🦄');
	batched('🌈');
	batched('🐻');

	await delay(600);

	t.deepEqual(receivedValues, [['🦄', '🌈', '🐻']]);

	batched('🍄');
	batched('🌰');

	await delay(200);

	t.deepEqual(receivedValues, [['🦄', '🌈', '🐻']]);

	await delay(400);

	t.deepEqual(receivedValues, [['🦄', '🌈', '🐻'], ['🍄', '🌰']]);
});

test('next batch runs immediately if function finishes slowly', async (t: ExecutionContext) => {
	const receivedValues: string[][] = [];

	const batched = batchedFunction<string>(async values => {
		await delay(1000);
		receivedValues.push([...values]);
	}, {
		delay: 500,
	});

	batched('🦄');
	batched('🌈');
	batched('🐻');

	// Starts running after 500ms, finishes at 1500ms
	await delay(1000);

	t.deepEqual(receivedValues, []);

	batched('🍄');
	batched('🌰');

	// Next call is at 1500ms, finishes at 2500ms
	await delay(600);

	t.deepEqual(receivedValues, [['🦄', '🌈', '🐻']]);

	await delay(1000);

	t.deepEqual(receivedValues, [['🦄', '🌈', '🐻'], ['🍄', '🌰']]);
});
