import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'; // This should be random and kept secure
const iv = crypto.randomBytes(16); // Initialization vector

// The `encrypt` function takes a Buffer or string and returns a hex string
function encrypt(text: Buffer | string): string {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// The `decrypt` function takes a hex string and returns a Buffer
function decrypt(hash: string): Buffer {
    const [iv, encryptedText] = hash.split(':').map(part => Buffer.from(part, 'hex'));

    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

    return decrypted;
}

export {
    encrypt,
    decrypt
}