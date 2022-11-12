import ecc from 'eosjs-ecc';

class KeyManagementUtils {
    
    getPublicKeyFromPrivate = async (privateKey) => {
        try {
            return ecc.PrivateKey.fromString(privateKey).toPublic().toString();
        } catch(error) {
            throw new Error(`Internal error!`);
        }
    }

    getPrivateKeyFromString = async (privateKeyString) => {
        try {
            return ecc.PrivateKey.fromString(privateKeyString);
        } catch(error) {
            throw new Error(`Internal error!`);
        }
    }

    generatePrivateKey = async () => {
        try {
            const temp = await ecc.randomKey();
            return temp.toString();
        } catch(error) {
            throw new Error(`Internal error!`);
        }
    }

    signMessage = async (message, privateKeyString) => {
        try {
            return ecc.sign(message, await this.getPrivateKeyFromString(privateKeyString));
        } catch(error) {
            throw new Error(`Unable to sign message!`);
        }
    }

    recoverPublicKey = async (signature, message) => {
        try {
            return ecc.recover(signature, message);
        } catch(error) {
            throw new Error(`Unable to recover public key. Please provide correct signature & message pair.`);
        }
    }
}

export default new KeyManagementUtils();