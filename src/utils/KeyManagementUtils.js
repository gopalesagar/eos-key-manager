import ecc from 'eosjs-ecc';
import constants from './Constants';
import DataStorageUtils from './DataStorageUtils';

class KeyManagementUtils {
    
    getPublicKeyFromPrivate = async (privateKey) => {
        try {
            return ecc.PrivateKey.fromString(privateKey).toPublic().toString();
        } catch(error) {
            throw new Error(constants.INTERNAL_ERROR);
        }
    }

    getPrivateKeyFromString = async (privateKeyString) => {
        try {
            return ecc.PrivateKey.fromString(privateKeyString);
        } catch(error) {
            console.log('ERROR: ', error.message);
            throw new Error(constants.INTERNAL_ERROR);
        }
    }

    generatePrivateKey = async () => {
        try {
            return (await ecc.randomKey()).toString();
        } catch(error) {
            throw new Error(constants.INTERNAL_ERROR);
        }
    }

    signMessage = async (message, privateKeyString) => {
        try {
            const t = ecc.sign(message, await this.getPrivateKeyFromString(privateKeyString));
            return t;
        } catch(error) {
            throw new Error(constants.UNABLE_TO_SIGN_MESSAGE_ERROR);
        }
    }

    recoverPublicKey = async (signature, message) => {
        try {
            const publicKey = ecc.recover(signature, message);
            const storedPublicKeys = DataStorageUtils.getStoredPublicKeys();
            if(!storedPublicKeys.includes(publicKey)) {
                throw new Error(constants.UNABLE_TO_RECOVER_PUBLIC_KEY_ERROR);
            }
            return publicKey;
        } catch(error) {
            throw new Error(constants.UNABLE_TO_RECOVER_PUBLIC_KEY_ERROR);
        }
    }
}

export default new KeyManagementUtils();