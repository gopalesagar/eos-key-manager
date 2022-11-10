import * as crypto from 'crypto';
import  secureLocalStorage  from  "react-secure-storage";
import * as ecc from 'eosjs-ecc';
import { isEmpty } from 'lodash';

export const constants = {
    ALGORITHM_AES256_CBC: 'aes-256-cbc',
    ALGORITHM_SHA256: 'sha256',
    ENCODING_BINARY: 'binary',
    ENCODING_HEX: 'hex',
    NUMBER_OF_KEYS: 5
}

// Encryption & decryption related functions
const getIv = async () => {
    const resizedIV = Buffer.allocUnsafe(16);
    const iv = crypto.createHash('sha256').update('hashedIV').digest();
    iv.copy(resizedIV);
    return resizedIV;
}

export const getKey = async (secret) => {
    const key = crypto.createHash(constants.ALGORITHM_SHA256).update(secret).digest();
    return key;
}

export const getCipheriv = async (secret) => {
    return crypto.createCipheriv(constants.ALGORITHM_AES256, await getKey(secret), await getIv());
}

export const getDecipheriv = async (secret) => {
    const decipher = crypto.createDecipheriv(constants.ALGORITHM_AES256, await getKey(secret), await getIv());
    return decipher;
}

//TODO: Remove constants. if not required in whole project
export const getDecrypted = async (publicKey, encryptedPrivateKey, secret) => {
    let encryptedText = Buffer.from(encryptedPrivateKey, constants.ENCODING_HEX);
    let decipher = crypto.createDecipheriv(constants.ALGORITHM_AES256_CBC, await getKey(secret), await getIv());
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]).toString();
    return { [publicKey]: decrypted};
}

export const getEncrypted = async (publicKey, privateKey, secret) => {
    let cipher = crypto.createCipheriv(constants.ALGORITHM_AES256_CBC, await getKey(secret), await getIv());
    let encrypted = cipher.update(privateKey);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { [publicKey]: encrypted.toString(constants.ENCODING_HEX)};
}

// Storage related utilities
export const getStoredData = (type) => {
    return secureLocalStorage.getItem(type);
}

export const saveData = async (type, data) => {
    const mergedObject = {};
    if(Array.isArray(data)) {
        data.forEach(d => {
            Object.assign(mergedObject, d);
        });
    }
    secureLocalStorage.setItem(type, isEmpty(mergedObject) ? data : mergedObject);
}

export const clearData = async () => {
    secureLocalStorage.clear();
}

// EOS related functions
export const getPublicKeyFromPrivate = async (privateKey) => {
    return ecc.PrivateKey.fromString(privateKey).toPublic().toString();
}

const getPrivateKeyFromString = async (privateKeyString) => {
    return ecc.PrivateKey.fromString(privateKeyString);
}

export const generatePrivateKey = async () => {
    const privateKey = await ecc.PrivateKey.randomKey();
    return privateKey.toString();
}

export const signMessage = async (message, privateKeyString) => {
    console.log('privateKeyString', privateKeyString);
    return ecc.sign(message, await getPrivateKeyFromString(privateKeyString));
}