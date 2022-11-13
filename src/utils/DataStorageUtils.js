import secureLocalStorage from 'react-secure-storage';
import { isEmpty } from 'lodash';

class DataStorageUtils {

    getStoredData = (type) => {
        try {
            return secureLocalStorage.getItem(type);
        } catch(error) {
            throw new Error(`Error in fetching stored data`);
        }
    }

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
            throw new Error(`Error in saving data`);
        }
    }

    clearData = async () => {
        secureLocalStorage.clear();
    }
}

export default new DataStorageUtils();