// Node.js built-in APIs.
import { Buffer } from 'buffer';

// Third-party modules.
import Promise from 'bluebird';

// Type definitions.
type Message = string | Buffer | NodeJS.TypedArray | DataView;

/**
 * Generate a new asymmetric key pair of the Ed25519.
 *
 * @example
 * const keyPair = await generateKeyPair();
 * const publicKey: Buffer = keyPair.publicKey;
 * const privateKey: Buffer = keyPair.privateKey;
 */
export function generateKeyPair(seed?: Buffer): Promise<{ publicKey: Buffer; privateKey: Buffer }>;

/**
 * Calculate the signature on the passed message and keys.
 *
 * @example
 * const signature: Buffer = await sign('Hello, world!', publicKey, privateKey);
 */
export function sign(message: Message, publicKey: Buffer, privateKey: Buffer): Promise<Buffer>;

/**
 * Verify the provided data using the given message and signature.
 *
 * @example
 * const isVerified = await verify('Hello, world!', signature, publicKey);
 *
 * if (isVerified) {
 *   // ...
 * } else {
 *   // ...
 * }
 */
export function verify(message: Message, signature: Buffer, publicKey: Buffer): Promise<boolean>;
