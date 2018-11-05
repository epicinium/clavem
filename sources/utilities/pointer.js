// Helpers.
import initialized from '../helpers/initializer';

// Private data storage.
const addressMap = new WeakMap();
const heapMap = new WeakMap();

// Global ArrayBuffer instance.
let globalHeap;

// Private keys.
export const KeyOfInitialized = Symbol('@epicinium/clavem:utilities:pointer:initialized');

export default class Pointer {
	/**
	 * @param {number} size
	 * @param {ArrayLike<number>} initialData
	 * @returns {Pointer}
	 */
	constructor(size, initialData) {
		if (globalHeap === undefined) {
			throw new ReferenceError('Global heap is not registered');
		}

		this[KeyOfInitialized] = initialized.then(({ memory }) => {
			const address = memory.allocate(size);
			const heap = new Uint8Array(globalHeap, address, size);

			if (initialData) {
				heap.set(initialData);
			}

			addressMap.set(this, address);
			heapMap.set(this, heap);
		});
	}

	get heap() {
		if (!addressMap.has(this)) {
			throw new ReferenceError('WebAssembly binary has not initialized yet');
		}

		const heap = heapMap.get(this);

		return heap;
	}

	valueOf() {
		if (!addressMap.has(this)) {
			throw new ReferenceError('WebAssembly binary has not initialized yet');
		}

		const address = addressMap.get(this);

		return address;
	}
}

export function registerGlobalHeap(heap) {
	globalHeap = heap;
}
