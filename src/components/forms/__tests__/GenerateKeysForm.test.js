import React from "react";
import { render } from '@testing-library/react';
import GenerateKeysForm from '../GenerateKeysForm';

it('renders correctly', () => {
    const { queryByTestId, queryByPlaceholderText } = render(<GenerateKeysForm/>);
    expect(queryByTestId('generateEncryptionKeyForm')).toBeTruthy();
    expect(queryByTestId('submitButton')).toBeTruthy();
    expect(queryByTestId('pincodeInput')).toBeTruthy();
    expect(queryByPlaceholderText('Enter a code for encryption')).toBeTruthy();
});