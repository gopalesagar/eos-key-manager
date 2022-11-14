import EncryptionUtils from '../EncryptionUtils';
import crypto from 'crypto';
import constants from '../Constants';

const { getDecrypted, getEncrypted } = EncryptionUtils;
const {
    TEST_PRIVATE_KEY,
    TEST_PUBLIC_KEY,
    TEST_SECRET,
    UNABLE_TO_ENCRYPT_ERROR,
    TEST_HASH,
    ENCRYPTION_PART_1,
    ENCRYPTION_PART_2,
    TEST_ENCRYPTED_BUFFER_1,
    TEST_ENCRYPTED_BUFFER_2,
    TEST_ENCRYPTED_PRIVATE_KEY
} = constants;
const mockHashUpdate = jest.fn();
const mockHashDigest = jest.fn();
const mockCipherUpdate = jest.fn();
const mockCipherFinal = jest.fn();

afterEach(() => {
    jest.restoreAllMocks();
});

describe('ENCRYPTION UTILITIES', () => {
    describe('getEncrypted', () => {
        
        it('should return return encrypted private key, mapped with public key', async () => {
            // given
            const createHashMock = {
                update: mockHashUpdate.mockReturnThis(),
                digest: mockHashDigest.mockReturnValueOnce(TEST_HASH)
            };
            const mockCreateHash = jest.spyOn(crypto, 'createHash').mockImplementationOnce(() => createHashMock);

            const cipherIvMock = {
                update: mockCipherUpdate.mockReturnValueOnce(TEST_ENCRYPTED_BUFFER_1()),
                final: mockCipherFinal.mockReturnValueOnce(TEST_ENCRYPTED_BUFFER_2())
            };
        
            const mockCreateCipheriv = jest.spyOn(crypto, 'createCipheriv').mockImplementationOnce(() => cipherIvMock);
            

            const spyOnGetKey = jest.spyOn(EncryptionUtils, 'getKey');
            const spyOnGetIv = jest.spyOn(EncryptionUtils, 'getIv');
            const spyOngetCipheriv = jest.spyOn(EncryptionUtils, 'getCipheriv');

            // when
            const t = await getEncrypted(TEST_PUBLIC_KEY, TEST_PRIVATE_KEY, TEST_SECRET);
            
            // then
            expect(t).toEqual({ [TEST_PUBLIC_KEY]: TEST_ENCRYPTED_PRIVATE_KEY() });
            expect(mockCreateCipheriv).toHaveBeenCalledTimes(1);
            expect(mockCreateHash).toHaveBeenCalledTimes(2);
            expect(mockHashUpdate).toHaveBeenCalledTimes(1);
            expect(mockHashUpdate).toHaveBeenCalledWith(TEST_SECRET);    
            expect(mockHashDigest).toHaveBeenCalledTimes(1);
            expect(mockHashDigest).toHaveReturnedWith(TEST_HASH);
            expect(mockCipherUpdate).toHaveBeenCalledTimes(1);
            expect(mockCipherUpdate).toHaveReturnedWith(TEST_ENCRYPTED_BUFFER_1());
            expect(mockCipherFinal).toHaveBeenCalledTimes(1);
            expect(mockCipherFinal).toHaveReturnedWith(TEST_ENCRYPTED_BUFFER_2());
            expect(spyOngetCipheriv).toHaveBeenCalledTimes(1);
            expect(spyOngetCipheriv).toHaveBeenCalledWith(TEST_SECRET);
            expect(spyOnGetKey).toHaveBeenCalledTimes(1);
            expect(spyOnGetKey).toHaveBeenCalledWith(TEST_SECRET);
            expect(spyOnGetIv).toHaveBeenCalledTimes(1);
        });

        it('should handle and throw error if createCipheriv fails', async () => {
            // given
            const createHashMock = {
                update: mockHashUpdate.mockReturnThis(),
                digest: mockHashDigest.mockReturnValue(TEST_HASH)
            };
            jest.spyOn(crypto, 'createCipheriv').mockImplementationOnce(() => {throw new Error()});
            const mockCreateHash = jest.spyOn(crypto, 'createHash').mockImplementationOnce(() => createHashMock);

            const spyOnGetKey = jest.spyOn(EncryptionUtils, 'getKey');
            const spyOnGetIv = jest.spyOn(EncryptionUtils, 'getIv');
            const spyOngetCipheriv = jest.spyOn(EncryptionUtils, 'getCipheriv');

            // when
            try {
                await getEncrypted(TEST_PUBLIC_KEY, TEST_PRIVATE_KEY, TEST_SECRET);
            } catch (error) {
                // then
                expect(error.message).toEqual(UNABLE_TO_ENCRYPT_ERROR);
                expect(spyOngetCipheriv).toHaveBeenCalledTimes(1);
                expect(spyOngetCipheriv).toHaveBeenCalledWith(TEST_SECRET);
                expect(spyOnGetIv).toHaveBeenCalledTimes(1);
                expect(spyOnGetKey).toHaveBeenCalledTimes(1);
                expect(mockCreateHash).toHaveBeenCalledTimes(2);
            }
        });

        it('should handle and throw error if cipher update fails', async () => {
            // given
            const cipherIvMock = {
                update: mockCipherUpdate.mockImplementationOnce(() => {
                    throw new Error();
                }),
                final: mockCipherFinal.mockReturnValueOnce(TEST_ENCRYPTED_BUFFER_2)
            };
            const createHashMock = {
                update: mockHashUpdate.mockReturnThis(),
                digest: mockHashDigest.mockReturnValue(TEST_HASH)
            };
            jest.spyOn(crypto, 'createCipheriv').mockImplementationOnce(() => cipherIvMock);
            const mockCreateHash = jest.spyOn(crypto, 'createHash').mockImplementationOnce(() => createHashMock);

            const spyOnGetKey = jest.spyOn(EncryptionUtils, 'getKey');
            const spyOnGetIv = jest.spyOn(EncryptionUtils, 'getIv');
            const spyOngetCipheriv = jest.spyOn(EncryptionUtils, 'getCipheriv');

            // when
            try {
                await getEncrypted(TEST_PUBLIC_KEY, TEST_PRIVATE_KEY, TEST_SECRET);
            } catch (error) {
                // then
                expect(error.message).toEqual(UNABLE_TO_ENCRYPT_ERROR);
                expect(spyOngetCipheriv).toHaveBeenCalledTimes(1);
                expect(spyOngetCipheriv).toHaveBeenCalledWith(TEST_SECRET);
                expect(spyOnGetIv).toHaveBeenCalledTimes(1);
                expect(spyOnGetKey).toHaveBeenCalledTimes(1);
                expect(mockCreateHash).toHaveBeenCalledTimes(2);
            }
        }); 
    });

    describe('getDecrypted', () => {
        it('should return return decrypted private key, mapped with public key', async () => {
            // given
            const decipherIvMock = {
                update: mockCipherUpdate.mockReturnValueOnce(TEST_ENCRYPTED_BUFFER_1()),
                final: mockCipherFinal.mockReturnValueOnce(TEST_ENCRYPTED_BUFFER_2())
            };
            const createHashMock = {
                update: mockHashUpdate.mockReturnThis(),
                digest: mockHashDigest.mockReturnValue(TEST_HASH)
            };
        
            const mockCreateDecipheriv = jest.spyOn(crypto, 'createDecipheriv').mockImplementationOnce(() => decipherIvMock);

            const mockCreateHash = jest.spyOn(crypto, 'createHash').mockImplementationOnce(() => createHashMock);

            const spyOnGetKey = jest.spyOn(EncryptionUtils, 'getKey');
            const spyOnGetDecipheriv = jest.spyOn(EncryptionUtils, 'getDecipheriv');

            // when
            const t = await getDecrypted(TEST_PUBLIC_KEY, TEST_PRIVATE_KEY, TEST_SECRET);
            
            // then
            expect(t).toEqual({ [TEST_PUBLIC_KEY]: `${ENCRYPTION_PART_1}${ENCRYPTION_PART_2}` });
            expect(mockCreateDecipheriv).toHaveBeenCalledTimes(1);

            expect(mockCreateHash).toHaveBeenCalledTimes(2);
            
            // expect(mockHashUpdate).toHaveBeenCalledTimes(1);
            // expect(mockHashUpdate).toHaveBeenCalledWith(TEST_SECRET);    
            // expect(mockHashDigest).toHaveBeenCalledTimes(1);

            expect(mockCipherUpdate).toHaveBeenCalledTimes(1);
            expect(mockCipherFinal).toHaveBeenCalledTimes(1);
            expect(spyOnGetDecipheriv).toHaveBeenCalledTimes(1);
            expect(spyOnGetDecipheriv).toHaveBeenCalledWith(TEST_SECRET);
            expect(spyOnGetKey).toHaveBeenCalledTimes(1);
            expect(spyOnGetKey).toHaveBeenCalledWith(TEST_SECRET);
        });

        it('should handle and throw error if createDecipheriv fails', async () => {
            // given
            const createHashMock = {
                update: mockHashUpdate.mockReturnThis(),
                digest: mockHashDigest.mockReturnValue(TEST_HASH)
            };
            jest.spyOn(crypto, 'createCipheriv').mockImplementationOnce(() => {throw new Error()});
            const mockCreateHash = jest.spyOn(crypto, 'createHash').mockImplementationOnce(() => createHashMock);

            const spyOnGetKey = jest.spyOn(EncryptionUtils, 'getKey');
            const spyOnGetIv = jest.spyOn(EncryptionUtils, 'getIv');
            const spyOngetCipheriv = jest.spyOn(EncryptionUtils, 'getCipheriv');

            // when
            try {
                await getEncrypted(TEST_PUBLIC_KEY, TEST_PRIVATE_KEY, TEST_SECRET);
            } catch (error) {
                // then
                expect(error.message).toEqual(UNABLE_TO_ENCRYPT_ERROR);
                expect(spyOngetCipheriv).toHaveBeenCalledTimes(1);
                expect(spyOngetCipheriv).toHaveBeenCalledWith(TEST_SECRET);
                
                expect(spyOnGetIv).toHaveBeenCalledTimes(1);
                expect(spyOnGetKey).toHaveBeenCalledTimes(1);
                expect(mockCreateHash).toHaveBeenCalledTimes(2);
            }
        });

        it('should handle and throw error if cipher update fails', async () => {
            // given
            const cipherIvMock = {
                update: mockCipherUpdate.mockImplementationOnce(() => {
                    throw new Error();
                }),
                final: mockCipherFinal.mockReturnValueOnce(TEST_ENCRYPTED_BUFFER_2)
            };
            const createHashMock = {
                update: mockHashUpdate.mockReturnThis(),
                digest: mockHashDigest.mockReturnValue(TEST_HASH)
            };
            jest.spyOn(crypto, 'createCipheriv').mockImplementationOnce(() => cipherIvMock);
            const mockCreateHash = jest.spyOn(crypto, 'createHash').mockImplementationOnce(() => createHashMock);

            const spyOnGetKey = jest.spyOn(EncryptionUtils, 'getKey');
            const spyOnGetIv = jest.spyOn(EncryptionUtils, 'getIv');
            const spyOngetCipheriv = jest.spyOn(EncryptionUtils, 'getCipheriv');

            // when
            try {
                await getEncrypted(TEST_PUBLIC_KEY, TEST_PRIVATE_KEY, TEST_SECRET);
            } catch (error) {
                // then
                expect(error.message).toEqual(UNABLE_TO_ENCRYPT_ERROR);

                expect(spyOngetCipheriv).toHaveBeenCalledTimes(1);
                expect(spyOngetCipheriv).toHaveBeenCalledWith(TEST_SECRET);

                expect(spyOnGetIv).toHaveBeenCalledTimes(1);
                expect(spyOnGetKey).toHaveBeenCalledTimes(1);
                expect(mockCreateHash).toHaveBeenCalledTimes(2);
            }
        }); 
    });
});