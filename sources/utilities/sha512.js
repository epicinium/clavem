// Node.js built-in APIs.
import { Buffer } from 'buffer'; // eslint-disable-line no-unused-vars
import { createHash } from 'crypto';

/**
 * @param {(string | Buffer | NodeJS.TypedArray | DataView)[]} data
 * @returns {Buffer}
 */
const sha512 = (...data) => data.reduce((hash, data) => hash.update(data), createHash('sha512')).digest();

export default sha512;
