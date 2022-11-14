const constants = {
    ALGORITHM_AES256_CBC: 'aes-256-cbc',
    ALGORITHM_SHA256: 'sha256',
    ENCODING_BINARY: 'binary',
    ENCODING_HEX: 'hex',
    NUMBER_OF_KEYS: 5,
    TEST_PRIVATE_KEY: '5Hwa1EdRiwv3MQr5ZEqVUm8GxrdYNdLZmWZ4AK4Jx3KHyQzXkoq',
    TEST_PUBLIC_KEY: 'EOS6aQEnDFaVqT6UzWEvs31iLcKYp6p53dFviVHwJFX3u4N54bTxZ',
    TEST_SECRET: 'This is test secret',
    UNABLE_TO_ENCRYPT_ERROR: 'Unable to encrypt private key. Please check the pincode.',
    TEST_HASH: 'TEST_HASH',
    ENCRYPTION_PART_1: 'ENCRYPTION_PART_1',
    ENCRYPTION_PART_2: 'ENCRYPTION_PART_',
    TEST_ENCRYPTED_BUFFER_1: () => Buffer.from(constants.ENCRYPTION_PART_1),
    TEST_ENCRYPTED_BUFFER_2: () => Buffer.from(constants.ENCRYPTION_PART_2),
    TEST_ENCRYPTED_PRIVATE_KEY: () => Buffer.concat([constants.TEST_ENCRYPTED_BUFFER_1(), constants.TEST_ENCRYPTED_BUFFER_2()]).toString('hex'),
    TEST_MESSAGE: 'This is a test message',
    INTERNAL_ERROR: 'Internal error!',
    UNABLE_TO_SIGN_MESSAGE_ERROR: 'Unable to sign message!',
    UNABLE_TO_RECOVER_PUBLIC_KEY_ERROR: 'Unable to recover public key. Please provide correct signature & message pair.',
    TEST_SIGNATURE: 'SIG_K1_KfJCeyFNLZUcK2XxWrRRsmLaie3pcuW8XXsawX4mnHvEnM7HC4M87ZCtho5wjQ3DcEUtjYH8FpCDVc1HrJ58qZqVELorNL'

}
export default constants;