import crypto from 'crypto';
import constants from '../utils/Constants';

class EncryptionUtils {
    getIv = async () => {
        try {
            const resizedIV = Buffer.allocUnsafe(16);
            const iv = crypto.createHash(constants.ALGORITHM_SHA256).update('hashedIV').digest();
            iv.copy(resizedIV);
            return resizedIV;
        } catch (error) {
            console.log('ERROR getIv', error.message);
            throw new Error(`Error in encrypting/decrypting`);
        }
    }

    getKey = async (secret) => {
        try {
            return crypto.createHash(constants.ALGORITHM_SHA256).update(secret).digest();
        } catch (error) {
            console.log('ERROR getKey', error.message);
            throw new Error(`Error in encrypting/decrypting`);
        }
    }

    getCipheriv = async (secret) => {
        try {
            return crypto.createCipheriv(constants.ALGORITHM_AES256_CBC, await this.getKey(secret), await this.getIv());
        } catch (error) {
            console.log('ERROR getCipheriv', error.message);
            throw new Error(`Error in encrypting/decrypting`);
        }
    }

    getDecipheriv = async (secret) => {
        try {
            return crypto.createDecipheriv(constants.ALGORITHM_AES256_CBC, await this.getKey(secret), await this.getIv());;
        } catch {
            console.log('ERROR getDecipheriv', error.message);
            throw new Error(`Error in encrypting/decrypting`);
        }
    }

    getEncrypted = async (publicKey, privateKey, secret) => {
        try {
            let cipher = await this.getCipheriv(secret);
            console.log('TEST1');
            let encrypted = cipher.update(privateKey);
            console.log('TEST2');
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            console.log('TEST3');
            return { [publicKey]: encrypted.toString(constants.ENCODING_HEX)};
        } catch (error) {
            console.log('ERROR ', error.message)
            throw new Error(`Unable to encrypt private key. Please check the pincode.`);
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
            throw new Error(`Unable to decrypt private key!`);
        }
    }
}

export default new EncryptionUtils();