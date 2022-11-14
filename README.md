## About The Project

The main functionality of this app is to demonstrate generation of public/private keypair, sign message and recover public key using the node package [eosjs-ecc](https://www.npmjs.com/package/eosjs-ecc). This ReactJs based app has 3 main screens.
* Generate keys: 
    * Inputs: 
        * Secret/pincode
    * Generates 5 keys pairs and encrypts the private keys using NodeJs core module [crypto](https://nodejs.org/api/crypto.html)
    * The public and encrypted private key mappings are stored in local storage with one more level of encryption
    * The extra level of encryption is taken care by [react-secure-storage](https://github.com/sushinpv/react-secure-storage). This ensures that the encrypted store can be utilized by that browser only. We can also use file system to download keys and but to avoid overhead of file processing local storage was used.
* Sign Message:
    * Inputs:
        * Message to be encrypted
        * Public key to be used for signing(Select dropdown)
        * Secret/pincode to be used for decryption of private key(Encrypted in first screen)
    * Signs the message and displays the signature
* Recover Public Key
    * Inputs:
        * Message that was signed
        * Signature of signed message
    * Recovers and displays the public key 

## Test Cases
Unit tests are in place for the utilities to encrypt, sign and recover key and can be ran using
```npm test```

The test cases for frontend are minimal and check only rendering of components.

### 

## Getting Started
Clone the project. The main branch has the latest code.

### Prerequisites
* Have [Node.js](https://nodejs.org/en/) installed on your local machine
* Create a .env file in the root with following values
  ```sh
  SECURE_LOCAL_STORAGE_HASH_KEY=<any scret key to be used internally by react-secure-storage>
  ```
* Install node modules
  ```sh
  npm install
  ```
## Run the project
Use command ```npm start``` to run the project.

## License
Distributed under the MIT License. See `LICENSE.txt` for more information.

## Contact
[@xception89](https://twitter.com/xception89) - sagarsgopale@gmail.com

Project Link: [https://github.com/gopalesagar/eos-key-manager](https://github.com/gopalesagar/eos-key-manager)