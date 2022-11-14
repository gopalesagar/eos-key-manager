import crypto from 'crypto';
import constants from './Constants';

const {
    ALGORITHM_SHA256,
    ERROR_IN_ENCRYPTION_DECRYPTION,
    HASH_KEY,
    ALGORITHM_AES256_CBC,
    ENCODING_HEX,
    UNABLE_TO_ENCRYPT_ERROR,
    UNABLE_TO_DECRYPT_ERROR
} = constants;

class EncryptionUtils {
    getIv = async () => {
        try {
            const resizedIV = Buffer.allocUnsafe(16);
            const iv = crypto.createHash(ALGORITHM_SHA256).update(HASH_KEY).digest();
            iv.copy(resizedIV);
            return resizedIV;
        } catch (error) {
            throw new Error(ERROR_IN_ENCRYPTION_DECRYPTION);
        }
    }

    getKey = async (secret) => {
        try {
            return crypto.createHash(ALGORITHM_SHA256).update(secret).digest();
        } catch (error) {
            throw new Error(ERROR_IN_ENCRYPTION_DECRYPTION);
        }
    }

    getCipheriv = async (secret) => {
        try {
            return crypto.createCipheriv(ALGORITHM_AES256_CBC, await this.getKey(secret), await this.getIv());
        } catch (error) {
            throw new Error(ERROR_IN_ENCRYPTION_DECRYPTION);
        }
    }

    getDecipheriv = async (secret) => {
        try {
            return crypto.createDecipheriv(ALGORITHM_AES256_CBC, await this.getKey(secret), await this.getIv());;
        } catch (error) {
            throw new Error(ERROR_IN_ENCRYPTION_DECRYPTION);
        }
    }

    getEncrypted = async (publicKey, privateKey, secret) => {
        try {
            let cipher = await this.getCipheriv(secret);
            let encrypted = cipher.update(privateKey);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return { [publicKey]: encrypted.toString(ENCODING_HEX)};
        } catch (error) {
            throw new Error(UNABLE_TO_ENCRYPT_ERROR);
        }
    }

    getDecrypted = async (publicKey, encryptedPrivateKey, secret) => {
        try {
            let encryptedText = Buffer.from(encryptedPrivateKey, ENCODING_HEX);
            let decipher = await this.getDecipheriv(secret);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]).toString();
            return { [publicKey]: decrypted};
        } catch (error) {
            throw new Error(UNABLE_TO_DECRYPT_ERROR);
        }
    }
}

export default new EncryptionUtils();