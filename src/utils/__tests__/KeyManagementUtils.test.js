import KeyManagementUtils from '../KeyManagementUtils';

const TEST_PRIVATE_KEY = '5Hwa1EdRiwv3MQr5ZEqVUm8GxrdYNdLZmWZ4AK4Jx3KHyQzXkoq';
const TEST_PUBLIC_KEY = 'EOS6aQEnDFaVqT6UzWEvs31iLcKYp6p53dFviVHwJFX3u4N54bTxZ';
const TEST_MESSAGE = 'This is a test message';
const INTERNAL_ERROR = 'Internal error!';
const UNABLE_TO_SIGN_MESSAGE_ERROR = 'Unable to sign message!';
const UNABLE_TO_RECOVER_PUBLIC_KEY_ERROR = 'Unable to recover public key. Please provide correct signature & message pair.';
const DEFAULT_ERROR = 'DEFAULT_ERROR';

let TEST_SIGNATURE = 'SIG_K1_KfJCeyFNLZUcK2XxWrRRsmLaie3pcuW8XXsawX4mnHvEnM7HC4M87ZCtho5wjQ3DcEUtjYH8FpCDVc1HrJ58qZqVELorNL';

const { generatePrivateKey, signMessage, recoverPublicKey } = KeyManagementUtils;
const mockToString = jest.fn();
const mockFromString = jest.fn();
const mockGetPrivateKeyFromString = jest.fn();

jest.mock('eosjs-ecc', () => ({
    randomKey: () => ({
        toString: mockToString
    }),
    sign: () => TEST_SIGNATURE,
    recover: () => TEST_PUBLIC_KEY,
    PrivateKey: {
        fromString: () => mockFromString
    }
}));

describe('EOSJS-ECC UTILITIES', () => {
    beforeEach(() => {
        mockToString.mockRestore();
        mockFromString.mockRestore();
        mockGetPrivateKeyFromString.mockRestore();
    });

    describe('signMessage', () => {
        it('should return signature for message when correct parameters are passed', async () => {
            // when
            const t = await signMessage(TEST_MESSAGE, TEST_PRIVATE_KEY);
            
            // then
            expect(t).toEqual(TEST_SIGNATURE);
        });

        it('should handle and throw appropriate error when unable to generate private key from string provided', async () => {
            // given
            KeyManagementUtils.getPrivateKeyFromString = mockGetPrivateKeyFromString.mockRejectedValue(new Error());

            try {
                // when
                await signMessage(TEST_MESSAGE, TEST_PRIVATE_KEY);
            } catch (error) {
                // then
                expect(error.message).toEqual(UNABLE_TO_SIGN_MESSAGE_ERROR);
                expect(mockGetPrivateKeyFromString).toHaveBeenCalledTimes(1);
            }
        });
    });

    describe('generatePrivateKey', () => {
        it('should generate and return private key string', async () => {

            // given
            mockToString.mockImplementationOnce(() => TEST_PRIVATE_KEY);

            // when
            const privateKey = await generatePrivateKey();
            
            // then
            expect(privateKey).toEqual(TEST_PRIVATE_KEY);
            expect(mockToString).toHaveBeenCalledTimes(1);
        });

        it('should throw error if any issue in genrating key', async () => {

            // given
            mockToString.mockImplementationOnce(() => {
                throw new Error();
            });

            try {
                // when
                await generatePrivateKey();
            } catch(error) {
                // then
                expect(error.message).toEqual(INTERNAL_ERROR);
                expect(mockToString).toHaveBeenCalledTimes(1);
            }
        });
    });

    describe('recoverPublicKey', () => {
        it('should return public key when correct parameters are passed', async () => {
            // when
            const t = await recoverPublicKey(TEST_SIGNATURE, TEST_MESSAGE);
            // then
            expect(t).toEqual(TEST_PUBLIC_KEY);
        });
    });
});