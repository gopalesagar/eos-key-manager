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
    try {
        const resizedIV = Buffer.allocUnsafe(16);
        const iv = crypto.createHash('sha256').update('hashedIV').digest();
        iv.copy(resizedIV);
        return resizedIV;
    } catch (error) {
        throw new Error(`Error in encrypting/decrypting`);
    }
}

const getKey = async (secret) => {
    try {
        return crypto.createHash(constants.ALGORITHM_SHA256).update(secret).digest();
    } catch (error) {
        throw new Error(`Error in encrypting/decrypting`);
    }
}

const getCipheriv = async (secret) => {
    try {
        return crypto.createCipheriv(constants.ALGORITHM_AES256_CBC, await getKey(secret), await getIv());
    } catch (error) {
        throw new Error(`Error in encrypting/decrypting`);
    }
}

const getDecipheriv = async (secret) => {
    try {
        return crypto.createDecipheriv(constants.ALGORITHM_AES256_CBC, await getKey(secret), await getIv());;
    } catch {
        throw new Error(`Error in encrypting/decrypting`);
    }
}

//TODO: Remove constants. if not required in whole project
export const getDecrypted = async (publicKey, encryptedPrivateKey, secret) => {
    try {
        let encryptedText = Buffer.from(encryptedPrivateKey, constants.ENCODING_HEX);
        let decipher = await getDecipheriv(secret);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]).toString();
        return { [publicKey]: decrypted};
    } catch (error) {
        console.log(error.message);
        throw new Error(`Unable to decrypt private key!`);
    }
}

export const getEncrypted = async (publicKey, privateKey, secret) => {
    try {
        let cipher = await getCipheriv(secret);
        let encrypted = cipher.update(privateKey);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { [publicKey]: encrypted.toString(constants.ENCODING_HEX)};
    } catch (error) {
        console.log(error.message);
        throw new Error(`Unable to encrypt private key. Please check the pincode.`);
    }
}

// Storage related utilities
export const getStoredData = (type) => {
    try {
        return secureLocalStorage.getItem(type);
    } catch(error) {
        throw new Error(`Error in fetching stored data`);
    }
}

export const saveData = async (type, data) => {
    try {
        const mergedObject = {};
        if(Array.isArray(data)) {
            data.forEach(d => {
                Object.assign(mergedObject, d);
            });
        }
        secureLocalStorage.setItem(type, isEmpty(mergedObject) ? data : mergedObject);
    } catch(error) {
        throw new Error(`Error in saving data`);
    }
}

export const clearData = async () => {
    secureLocalStorage.clear();
}

// EOS related functions
export const getPublicKeyFromPrivate = async (privateKey) => {
    try {
        return ecc.PrivateKey.fromString(privateKey).toPublic().toString();
    } catch(error) {
        console.log(error);
        throw new Error(`Internal error!`);
    }
}

const getPrivateKeyFromString = async (privateKeyString) => {
    try {
        return ecc.PrivateKey.fromString(privateKeyString);
    } catch(error) {
        console.log(error);
        throw new Error(`Internal error!`);
    }
}

export const generatePrivateKey = async () => {
    try {
        return (await ecc.randomKey()).toString();
    } catch(error) {
        console.log(error);
        throw new Error(`Internal error!`);
    }
}

export const signMessage = async (message, privateKeyString) => {
    try {
        return ecc.sign(message, await getPrivateKeyFromString(privateKeyString));
    } catch(error) {
        throw new Error(`Unable to sign message!`);
    }
}

export const recoverPublicKey = async (signature, message) => {
    try {
        return ecc.recover(signature, message);
    } catch(error) {
        throw new Error(`Unable to recover public key. Please provide correct signature & message pair.`);
    }
}