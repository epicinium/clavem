# @epicinium/clavem

An implementation of Ed25519 by SUPERCOP ref10.

## Table of Contents

- [@epicinium/clavem](#epiciniumclavem)
    - [Table of Contents](#table-of-contents)
    - [Installation](#installation)
    - [Usage](#usage)
        - [generateKeyPair([seed])](#generatekeypairseed)
        - [sign(message, publicKey, privateKey)](#signmessage-publickey-privatekey)
        - [verify(message, signature, publicKey)](#verifymessage-signature-publickey)
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

## License

[MIT Licensed](LICENSE).
