import crypto from 'crypto';
import constants from './Constants';

class EncryptionUtils {
    getIv = async () => {
        try {
            const resizedIV = Buffer.allocUnsafe(16);
            const iv = crypto.createHash(constants.ALGORITHM_SHA256).update(constants.HASH_KEY).digest();
            iv.copy(resizedIV);
            return resizedIV;
        } catch (error) {
            throw new Error(constants.ERROR_IN_ENCRYPTION_DECRYPTION);
        }
    }

    getKey = async (secret) => {
        try {
            return crypto.createHash(constants.ALGORITHM_SHA256).update(secret).digest();
        } catch (error) {
            throw new Error(constants.ERROR_IN_ENCRYPTION_DECRYPTION);
        }
    }

    getCipheriv = async (secret) => {
        try {
            return crypto.createCipheriv(constants.ALGORITHM_AES256_CBC, await this.getKey(secret), await this.getIv());
        } catch (error) {
            throw new Error(constants.ERROR_IN_ENCRYPTION_DECRYPTION);
        }
    }

    getDecipheriv = async (secret) => {
        try {
            return crypto.createDecipheriv(constants.ALGORITHM_AES256_CBC, await this.getKey(secret), await this.getIv());;
        } catch (error) {
            throw new Error(constants.ERROR_IN_ENCRYPTION_DECRYPTION);
        }
    }

    getEncrypted = async (publicKey, privateKey, secret) => {
        try {
            let cipher = await this.getCipheriv(secret);
            let encrypted = cipher.update(privateKey);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return { [publicKey]: encrypted.toString(constants.ENCODING_HEX)};
        } catch (error) {
            throw new Error(constants.UNABLE_TO_ENCRYPT_ERROR);
        }
    }

    //TODO: Remove constants. if not required in whole project
    getDecrypted = async (publicKey, encryptedPrivateKey, secret) => {
        try {
            let encryptedText = Buffer.from(encryptedPrivateKey, constants.ENCODING_HEX);
            let decipher = await this.getDecipheriv(secret);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]).toString();
            return { [publicKey]: decrypted};
        } catch (error) {
            throw new Error(constants.UNABLE_TO_DECRYPT_ERROR);
        }
    }
}

export default new EncryptionUtils();