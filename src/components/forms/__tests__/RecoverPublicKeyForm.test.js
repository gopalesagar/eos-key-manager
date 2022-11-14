import React from "react";
import { render } from '@testing-library/react';
import RecoverPublicKeyForm from '../RecoverPublicKeyForm';

it('renders correctly', () => {
    const { queryByTestId, queryByPlaceholderText } = render(<RecoverPublicKeyForm/>);
    expect(queryByTestId('recoverKeyForm')).toBeTruthy();

    expect(queryByTestId('messageInput')).toBeTruthy();
    expect(queryByTestId('signatureInput')).toBeTruthy();

    expect(queryByTestId('submitButton')).toBeTruthy();
    expect(queryByPlaceholderText('Enter message')).toBeTruthy();
    expect(queryByPlaceholderText('Enter the signature')).toBeTruthy();
});