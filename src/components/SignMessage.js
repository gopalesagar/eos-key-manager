import React, { Component } from "react";
import SignMessageForm from './forms/SignMessageForm';
import DataStorageUtils from '../utils/DataStorageUtils';

class SignMessage extends Component {

    render() {
        return (
            <div>
                <SignMessageForm publicKeys={DataStorageUtils.getStoredPublicKeys()} />
            </div>
        )
    };
}

export default SignMessage;
