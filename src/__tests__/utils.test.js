import { generatePrivateKey, signMessage } from '../utils.js';
import {
    TEST_PRIVATE_KEY, TEST_PUBLIC_KEY, TEST_MESSAGE, TEST_SIGNATURE, INTERNAL_ERROR
} from './constants';

const mockToString = jest.fn();
const mockSign = jest.fn();
const mockPrivateKey = jest.fn();

jest.mock('crypto', () => ({
}));

jest.mock('react-secure-storage', () => ({
}));

jest.mock('eosjs-ecc', () => ({
    randomKey: () => ({
        toString: mockToString
    }),
    sign: () => mockSign,
    PrivateKey: () => mockPrivateKey
}));

describe('EOSJS-ECC UTILITIES', () => {
    describe('generatePrivateKey', () => {
        it('should generate and return private key string', async () => {

            // given
            mockToString.mockImplementationOnce(() => TEST_PRIVATE_KEY);

            // when
            const privateKey = await generatePrivateKey();
            
            // then
            expect(privateKey).toEqual(TEST_PRIVATE_KEY);
        });

        it('should throw error if any issue in genrating key', async () => {

            // given
            let err;
            mockToString.mockImplementationOnce(() => {
                throw new Error();
            });

            try {
                // when
                await generatePrivateKey();
            } catch(error) {
                err = error;
            } finally {
                // then
                // expecting in finally because of jest/no-conditional-expect
                expect(err.message).toEqual(INTERNAL_ERROR);
            }
        });
    });

    describe('signMessage', () => {
        it('should return signed message', async () => {

            // given
            mockSign.mockImplementation(() => TEST_SIGNATURE);

            // when
            const signature = await signMessage(TEST_MESSAGE, TEST_PRIVATE_KEY);
            
            // then
            expect(signature).toEqual(TEST_SIGNATURE);
        });

        // it('should throw error if any issue in genrating key', async () => {

        //     // given
        //     let err;
        //     mockToString.mockImplementation(() => {
        //         throw new Error();
        //     });

        //     try {
        //         // when
        //         await generatePrivateKey();
        //     } catch(error) {
        //         err = error;
        //     } finally {
        //         // then
        //         // expecting in finally because of jest/no-conditional-expect
        //         expect(err.message).toEqual(INTERNAL_ERROR);
        //     }
        // });
    });
});




