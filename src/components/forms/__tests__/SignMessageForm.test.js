import React from "react";
import { render } from '@testing-library/react';
import SignMessageForm from '../SignMessageForm';

it('renders correctly', () => {
    const publicKeys = ['pk1', 'pk12', 'pk3'];
    const { queryByTestId, queryByPlaceholderText } = render(<SignMessageForm publicKeys={publicKeys}/>);
    expect(queryByTestId('signMessageForm')).toBeTruthy();

    expect(queryByTestId('publicKeySelect')).toBeTruthy();
    expect(queryByTestId('pincodeInput')).toBeTruthy();

    expect(queryByTestId('submitButton')).toBeTruthy();
    expect(queryByPlaceholderText('Enter a message to sign')).toBeTruthy();
    expect(queryByPlaceholderText('Enter a code for decryption')).toBeTruthy();
});