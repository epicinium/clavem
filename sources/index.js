// Node.js built-in APIs.
import { Buffer } from 'buffer';
import { randomBytes } from 'crypto';

// Third-party modules.
import Promise from 'bluebird'; // eslint-disable-line no-unused-vars

// Utilities.
import Pointer, { registerGlobalHeap } from './utilities/pointer';
import sha512 from './utilities/sha512';

// Helpers.
import initialized from './helpers/initializer';
import wrap from './helpers/wrapper';

// WebAssembly references.
let [ projectiveToBytes, extendedToBytes, extendedFromBytes ] = [];
let [ geDoubleScalarMultVartime, geScalarMultBase, scMulAdd, scReduce ] = [];

const binary = initialized.then(({ heap, exports }) => {
	({ projectiveToBytes, extendedToBytes, extendedFromBytes } = exports);
	({ geDoubleScalarMultVartime, geScalarMultBase, scMulAdd, scReduce } = exports);

	registerGlobalHeap(heap);
});

/**
 * Generate a new asymmetric key pair of the Ed25519.
 *
 * @type {(seed?: Buffer) => Promise<{ publicKey: Buffer; privateKey: Buffer; }>}
 */
export const generateKeyPair = wrap(function* generateKeyPair(seed = randomBytes(32)) {
	yield binary;

	const privateKey = sha512(seed);

	privateKey[0] &= 248;
	privateKey[31] &= 63;
	privateKey[31] |= 64;

	const extendedPointer = yield new Pointer(160);
	const privateKeyPointer = yield new Pointer(64, privateKey);
	const publicKeyPointer = yield new Pointer(32);

	geScalarMultBase(extendedPointer, privateKeyPointer);
	extendedToBytes(publicKeyPointer, extendedPointer);

	const publicKey = Buffer.from(publicKeyPointer.heap);

	return { publicKey, privateKey };
});

/**
 * Calculate the signature on the passed message and keys.
 *
 * @type {(message: Message, publicKey: Buffer, privateKey: Buffer) => Promise<Buffer>}
 */
export const sign = wrap(function* sign(message, publicKey, privateKey) {
	yield binary;

	const hashPointer = yield new Pointer(64, sha512(privateKey.slice(32), message));
	const extendedPointer = yield new Pointer(160);
	const signaturePointer = yield new Pointer(64);

	scReduce(hashPointer);
	geScalarMultBase(extendedPointer, hashPointer);
	extendedToBytes(signaturePointer, extendedPointer);

	const messagePointer = yield new Pointer(64, sha512(publicKey, message));
	const privateKeyPointer = yield new Pointer(64, privateKey);

	scReduce(messagePointer);
	scMulAdd(signaturePointer + 32, messagePointer, privateKeyPointer, hashPointer);

	return Buffer.from(signaturePointer.heap);
});

/**
 * Verify the provided data using the given message and signature.
 *
 * @type {(message: Message, signature: Buffer, publicKey: Buffer) => Promise<boolean>}
 */
export const verify = wrap(function* verify(message, signature, publicKey) {
	yield binary;

	if ((signature[63] & 224) !== 0) {
		return false;
	}

	const extendedPointer = yield new Pointer(160);
	const publicKeyPointer = yield new Pointer(32, publicKey);

	if (extendedFromBytes(extendedPointer, publicKeyPointer) !== 0) {
		return false;
	}

	const hashPointer = yield new Pointer(64, sha512(publicKey, message));
	const projectivePointer = yield new Pointer(120);
	const signaturePointer = yield new Pointer(32, signature.slice(32));
	const checkerPointer = yield new Pointer(32);

	scReduce(hashPointer);
	geDoubleScalarMultVartime(projectivePointer, hashPointer, extendedPointer, signaturePointer);
	projectiveToBytes(checkerPointer, projectivePointer);

	return Buffer.compare(checkerPointer.heap, signature.slice(0, 32)) === 0;
});

/**
 * @typedef {string | Buffer | NodeJS.TypedArray | DataView} Message
 */
