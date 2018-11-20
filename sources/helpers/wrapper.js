// Third-party modules.
import Promise from 'bluebird';

// Utilities.
import Pointer, { KeyOfInitialized } from '../utilities/pointer';

// Helpers.
import initialized from './initializer';

// WebAssembly references.
let release;

const binary = initialized.then(({ memory }) => {
	({ release } = memory);
});

/**
 * Wrap a function in order to release allocated memory in automatically.
 *
 * @param {(...args: any[]) => IterableIterator<Promise<any> | Pointer>} generator
 * @returns {Promise<void>}
 */
const wrap = generator => async (...args) => {
	await binary;

	let resolve;
	let reject;

	const deferred = new Promise((...args) => {
		[ resolve, reject ] = args;
	});

	const pointers = [];
	const iterator = generator(...args);
	let result = iterator.next();

	while (!result.done) {
		const { value } = result;
		let yielded;

		if (typeof value === 'object' && typeof value.then === 'function') {
			try {
				yielded = await value; // eslint-disable-line no-await-in-loop
			} catch (error) {
				iterator.throw(error);
				reject(error);

				break;
			}
		} else {
			if (value instanceof Pointer) {
				await value[KeyOfInitialized]; // eslint-disable-line no-await-in-loop

				pointers.push(value);
			}

			yielded = value;
		}

		result = iterator.next(yielded);
	}

	for (const pointer of pointers) {
		release(pointer);
	}

	resolve(result.value);

	return deferred;
};

export default wrap;
