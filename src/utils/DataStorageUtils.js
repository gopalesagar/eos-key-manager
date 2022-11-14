import { isEmpty } from 'lodash';
import secureLocalStorage from 'react-secure-storage';

class DataStorageUtils {

    saveData = async (type, data) => {
        try {
            const mergedObject = {};
            if(Array.isArray(data)) {
                data.forEach(d => {
                    Object.assign(mergedObject, d);
                });
            }
            secureLocalStorage.setItem(type, isEmpty(mergedObject) ? data : mergedObject);
        } catch(error) {
            console.log('ERROR', error.message);
            throw new Error(`Error in saving data`);
        }
    }

    getStoredData = (type) => {
        try {
            return secureLocalStorage.getItem(type);
        } catch(error) {
            throw new Error(`Error in fetching stored data`);
        }
    }

    getStoredPublicKeys = () => {
        let publicKeys = [];
        let storedData =  this.getStoredData('object');
        if(!isEmpty(storedData)) publicKeys = Object.keys(storedData);
        return publicKeys;
    }

    clearData = async () => {
        secureLocalStorage.clear();
    }
}

export default new DataStorageUtils();