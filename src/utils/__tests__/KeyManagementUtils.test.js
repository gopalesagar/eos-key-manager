import KeyManagementUtils from '../KeyManagementUtils';
import DataStorageUtils from '../DataStorageUtils';
import ecc from 'eosjs-ecc';
import constants from '../Constants';

const {
    TEST_PRIVATE_KEY,
    TEST_PUBLIC_KEY,
    TEST_MESSAGE,
    INTERNAL_ERROR,
    UNABLE_TO_SIGN_MESSAGE_ERROR,
    UNABLE_TO_RECOVER_PUBLIC_KEY_ERROR,
    TEST_SIGNATURE,
    BAD_PUBLIC_KEY
} = constants;

const { generatePrivateKey, signMessage, recoverPublicKey } = KeyManagementUtils;
const mockToString = jest.fn();

afterEach(() => {
    jest.restoreAllMocks();
});

describe('KEY MANAGEMENT UTILITIES', () => {

    describe('signMessage', () => {

        describe('positive', () => {
            it('should return signature for message when correct parameters are passed', async () => {
                // given
                jest.spyOn(ecc, 'sign').mockImplementationOnce(() => { return TEST_SIGNATURE } );
                const mockGetPrivateKeyFromString = jest.spyOn(KeyManagementUtils, 'getPrivateKeyFromString');

                // when
                const t = await signMessage(TEST_MESSAGE, TEST_PRIVATE_KEY);

                // then
                expect(t).toEqual(TEST_SIGNATURE);
                expect(mockGetPrivateKeyFromString).toHaveBeenCalledTimes(1);
                expect(mockGetPrivateKeyFromString).toHaveBeenCalledWith(TEST_PRIVATE_KEY);
            });
        });

        describe('negative', () => {
            it('should handle and throw appropriate error when unable to sign', async () => {
                // given
                jest.spyOn(ecc, 'sign').mockImplementationOnce(() => { return TEST_SIGNATURE; } );
                const mockGetPrivateKeyFromString = jest.spyOn(KeyManagementUtils, 'getPrivateKeyFromString').mockImplementationOnce(() => {
                    throw new Error();
                });

                try {
                    // when
                    const t = await signMessage(TEST_MESSAGE, TEST_PRIVATE_KEY);
                } catch (error) {
                    // then
                    expect(error.message).toEqual(UNABLE_TO_SIGN_MESSAGE_ERROR);
                    expect(mockGetPrivateKeyFromString).toHaveBeenCalledTimes(1);
                    expect(mockGetPrivateKeyFromString).toHaveBeenCalledWith(TEST_PRIVATE_KEY);
                }
            });
        });
    });

    describe('generatePrivateKey', () => {
        describe('positive', () => {
            it('should generate and return private key string', async () => {
                const randomKeyMock = {
                    toString: mockToString.mockReturnValueOnce(TEST_PRIVATE_KEY)
                }
                // given
                jest.spyOn(ecc, 'randomKey').mockImplementationOnce(() => randomKeyMock);

                // when
                const privateKey = await generatePrivateKey();
                
                // then
                expect(privateKey).toEqual(TEST_PRIVATE_KEY);
                expect(mockToString).toHaveBeenCalledTimes(1);
            });
        });

        describe('negative', () => {
            it('should throw error if any issue in genrating key', async () => {

                // given
                const randomKeyMock = {
                    toString: mockToString.mockImplementation(() => { throw new Error(); })
                }
                jest.spyOn(ecc, 'randomKey').mockImplementationOnce(() => randomKeyMock);

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
    });

    describe('recoverPublicKey', () => {
        describe('positive', () => {
            it('should return public key when correct parameters are passed', async () => {
                // given
                const mockGetStoredPublicKeys = jest.spyOn(DataStorageUtils, 'getStoredPublicKeys').mockImplementation(() => [TEST_PUBLIC_KEY]);
                jest.spyOn(ecc, 'recover').mockImplementationOnce(() => TEST_PUBLIC_KEY);
                
                // when
                const t = await recoverPublicKey(TEST_SIGNATURE, TEST_MESSAGE);
                
                // then
                expect(t).toEqual(TEST_PUBLIC_KEY);
                expect(mockGetStoredPublicKeys).toHaveBeenCalledTimes(1);
            });
        });

        describe('negative', () => {
            it('should handle and throw error when unable to recover', async () => {
                // when
                jest.spyOn(ecc, 'recover').mockImplementationOnce(() => {throw new Error()});

                try {
                    await recoverPublicKey(TEST_SIGNATURE, TEST_MESSAGE);
                } catch (error) {
                    // then
                    expect(error.message).toEqual(UNABLE_TO_RECOVER_PUBLIC_KEY_ERROR);
                }
            });

            it('should handle and throw error when recovered public key is not existing or is incorrect', async () => {
                // given
                const mockGetStoredPublicKeys = jest.spyOn(DataStorageUtils, 'getStoredPublicKeys').mockImplementation(() => [BAD_PUBLIC_KEY]);
                jest.spyOn(ecc, 'recover').mockImplementationOnce(() => TEST_PUBLIC_KEY);

                try {
                    await recoverPublicKey(TEST_SIGNATURE, TEST_MESSAGE);
                } catch (error) {
                    // then
                    expect(error.message).toEqual(UNABLE_TO_RECOVER_PUBLIC_KEY_ERROR);
                    expect(mockGetStoredPublicKeys).toHaveBeenCalledTimes(1);
                }
            });
        });
    });
});