// Node.js built-in APIs.
const { Buffer } = require('buffer');
const { randomBytes } = require('crypto');

// Third-party modules.
const { describe, it } = require('mocha');
const { expect, use } = require('chai');
const chaiAsPromised = require('chai-as-promised');

// This module.
const { generateKeyPair, sign, verify } = require('..');

use(chaiAsPromised);

describe('@epicinium/clavem', () => {
	const message = randomBytes(32).toString('utf8');
	let publicKey;
	let privateKey;
	let signature;

	it('should generate asymmetric key pair of ed25519 without an error', async () => {
		const seed = randomBytes(32);
		const promise = generateKeyPair(seed);

		try {
			return Promise.all([
				expect(promise).to.not.eventually.rejected,
				expect(promise).to.eventually.have.property('publicKey'),
				expect(promise).to.eventually.have.property('privateKey')
			]);
		} finally {
			({ publicKey, privateKey } = await promise);
		}
	});

	it('should ensure that keys are valid', () => {
		expect(publicKey).to.be.an.instanceof(Buffer);
		expect(publicKey).to.have.property('length', 32, 'Expected length of the public key to be 32 characters');
		expect(privateKey).to.be.an.instanceof(Buffer);
		expect(privateKey).to.have.property('length', 64, 'Expected length of the private key to be 64 characters');
	});

	it('should sign a plain text without an error', async () => {
		const promise = sign(message, publicKey, privateKey);

		try {
			return expect(promise).to.not.eventually.rejected;
		} finally {
			signature = await promise;
		}
	});

	it('should ensure that signature is valid', () => {
		expect(signature).to.be.an.instanceof(Buffer);
		expect(signature).to.have.property('length', 64, 'Expected length of the signature to be 64 characters');
	});

	it('should verify a signature without an error', async () => {
		const promise = verify(message, signature, publicKey);

		return expect(promise).to.eventually.be.true;
	});

	it('should fail to verify a signature if message and signature are not right target of each other', async () => {
		const promise = verify('', signature, publicKey);

		return expect(promise).to.eventually.be.false;
	});
});
