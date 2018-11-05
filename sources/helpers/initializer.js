// Third-party modules.
import Promise from 'bluebird';

// Imports by WebAssembly.
import Module from '../binary'; // eslint-disable-line import/no-unresolved

const {
	// Dynamic memory allocator by C.
	_malloc: allocate,
	_free: release,

	// Raw heap memory of WebAssembly.
	HEAPU8: { buffer },

	// Exported from C.
	_projective_to_bytes: projectiveToBytes,
	_extended_to_bytes: extendedToBytes,
	_extended_from_bytes: extendedFromBytes,
	_ge_double_scalarmult_vartime: geDoubleScalarMultVartime,
	_ge_scalarmult_base: geScalarMultBase,
	_sc_muladd: scMulAdd,
	_sc_reduce: scReduce
} = Module;

// Constants.
const deferred = Promise.defer();

Module.onRuntimeInitialized = () => {
	const memory = { allocate, release };
	const heap = buffer;

	const exports = {
		projectiveToBytes,
		extendedToBytes,
		extendedFromBytes,
		geDoubleScalarMultVartime,
		geScalarMultBase,
		scMulAdd,
		scReduce
	};

	deferred.resolve({ memory, heap, exports });
};

export default deferred.promise;
