import React, { Component } from "react";
import SignMessageForm from './forms/SignMessageForm';
import { isEmpty } from 'lodash';
import { getStoredData } from '../utils';

class SignMessage extends Component {

    getPublicKeys = () => {
        let publicKeys = [];
        let storedData =  getStoredData('object');
        if(!isEmpty(storedData)) publicKeys = Object.keys(storedData);
        return publicKeys;
    }

    render() {
        return (
            <div>
                <SignMessageForm publicKeys={this.getPublicKeys()} />
            </div>
        )
    };
}

export default SignMessage;
