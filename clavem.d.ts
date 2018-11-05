// Node.js built-in APIs.
import { Buffer } from 'buffer';

// Third-party modules.
import Promise from 'bluebird';

// Type definitions.
type Message = string | Buffer | NodeJS.TypedArray | DataView;

/**
 * Generate a new asymmetric key pair of the Ed25519.
 */
export function generateKeyPair(seed?: Buffer): Promise<{ publicKey: Buffer; privateKey: Buffer }>;

/**
 * Calculate the signature on the passed message and keys.
 */
export function sign(message: Message, publicKey: Buffer, privateKey: Buffer): Promise<Buffer>;

/**
 * Verify the provided data using the given message and signature.
 */
export function verify(message: Message, signature: Buffer, publicKey: Buffer): Promise<boolean>;
