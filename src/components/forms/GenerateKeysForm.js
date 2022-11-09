import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { PrivateKey, PublicKey, Signature, Aes, key_utils, config } from 'eosjs-ecc';

import Form from 'react-bootstrap/Form';

export class GenerateKeysForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pincode: "",
            publicKeys: []
        }
    }

    handlePincode = event => {
        this.setState({
            pincode: event.target.value
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        alert(`Pincode: ${this.state.pincode}`);
        const privateKey = await PrivateKey.randomKey()
        let privateString = privateKey.toString();
        let pubkey = PrivateKey.fromString(privateString).toPublic().toString();
        const publicKeys = this.state.publicKeys;
        this.setState({
            publicKeys: 
        })
    }

    render() {
        return (
            <Container>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group className="mb-6" controlId="generateKeysForm">
                        <Form.Label>Pincode: </Form.Label>
                        <Form.Control value={this.state.pincode} onChange={this.handlePincode}></Form.Control>
                    </Form.Group>
                    <Button variant="outline-primary" type="submit">Generate</Button>
                </Form>
            </Container>
        )
    }
}

export default GenerateKeysForm;