import {expectType} from 'tsd';
import batchedFunction from '../source/index.js';

const batched = batchedFunction<string>(values => {
	expectType<string[]>(values);
});

batched('🦄');
