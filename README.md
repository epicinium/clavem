# @epicinium/clavem

An implementation of Ed25519 by SUPERCOP ref10.

[![Build Status][travis ci badge]][travis ci][![License][license badge]](LICENSE)[![Package Version][npm package version badge]][npm package]

## Table of Contents

- [@epicinium/clavem](#epiciniumclavem)
    - [Table of Contents](#table-of-contents)
    - [Installation](#installation)
    - [Usage](#usage)
        - [generateKeyPair([seed])](#generatekeypairseed)
        - [sign(message, publicKey, privateKey)](#signmessage-publickey-privatekey)
        - [verify(message, signature, publicKey)](#verifymessage-signature-publickey)
    - [Contributing](#contributing)
        - [Requisites](#requisites)
    - [Trivia](#trivia)
    - [License](#license)

## Installation

```sh
$ npm install --save @epicinium/clavem
```

## Usage

### generateKeyPair([seed])

Generate a new asymmetric key pair of the Ed25519.

**Definition**

```ts
function generateKeyPair(seed?: Buffer = crypto.randomBytes(32)): Promise<{ publicKey: Buffer; privateKey: Buffer }>;
```

**Example**

```js
const { publicKey, privateKey } = await generateKeyPair();
```

---

### sign(message, publicKey, privateKey)

Calculate the signature on the passed message and keys.

**Definition**

```ts
function sign(message: Message, publicKey: Buffer, privateKey: Buffer): Promise<Buffer>;
```

**Example**

```js
const signature = await sign('Hello, world!', publicKey, privateKey);
```

---

### verify(message, signature, publicKey)

Verify the provided data using the given message and signature.

**Definition**

```ts
function verify(message: Message, signature: Buffer, publicKey: Buffer): Promise<boolean>;
```

**Example**

```js
const isVerified = await verify('Hello, world!', signature, publicKey);

if (isVerified) {
    // ...
} else {
    // ...
}
```

## Contributing

### Requisites

-   [Node.js](https://nodejs.org/) LTS Dubnium v10.13.0+
-   [emscripten](https://kripken.github.io/emscripten-site/) v1.38.15+

## Trivia

**clavem** means **key** in the Latin Language.

## License

[MIT Licensed](LICENSE).

[travis ci badge]: https://img.shields.io/travis/com/epicinium/clavem/develop.svg?style=flat-square
[travis ci]: https://travis-ci.com/epicinium/clavem
[license badge]: https://img.shields.io/github/license/epicinium/clavem.svg?style=flat-square
[npm package version badge]: https://img.shields.io/npm/v/@epicinium/clavem.svg?style=flat-square
[npm package]: https://www.npmjs.com/package/@epicinium/clavem
