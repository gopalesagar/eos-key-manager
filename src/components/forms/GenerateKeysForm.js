import React, { Component } from "react";
import { Button, Container, ListGroup, Form, Spinner, Row, Col } from 'react-bootstrap';
import { constants, saveData, getEncrypted, getPublicKeyFromPrivate, generatePrivateKey, clearData } from '../../utils';

export class GenerateKeysForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pincode: "",
            publicKeys: [],
            isSubmitting: false
        }
    }

    handlePincodeInput = event => {
        this.setState({
            pincode: event.target.value
        });
    }

    toggleLoader = async () => {
        const status = this.state.isSubmitting ? false : true;
        this.setState({ isSubmitting: status });
    }


    handleSubmit = async (event) => {
        let publicKey;
        let publicKeys = [];

        event.preventDefault();
        await this.toggleLoader();
        await clearData();
        const encryptionPromises = [];
        for(let i = 1; i <= constants.NUMBER_OF_KEYS; i++) {
            const privateKeyString = await generatePrivateKey();
            publicKey = await getPublicKeyFromPrivate(privateKeyString);

            encryptionPromises.push(await getEncrypted(publicKey, privateKeyString, this.state.pincode));

            publicKeys = this.state.publicKeys;
            publicKeys.push(publicKey);
        }
        const encryptedKeysResponse = await Promise.all(encryptionPromises);

        // TODO: Store encryptedKeysResponse somewhere
        await saveData('object', encryptedKeysResponse);
        this.setState({ publicKeys });
        await this.toggleLoader();
    }
    
    render() {
        return (
            <Container style={{ display: 'block', width: 700, padding: 30 }}>
                <Form onSubmit={this.handleSubmit} id="generateEncryptionKeyForm">
                    <Form.Group className="mb-6">
                        <Row>
                            <Col><Form.Label>Pincode: </Form.Label></Col>
                            <Col><Form.Control required placeholder="Enter a code for encryption" value={this.state.pincode} onChange={this.handlePincodeInput}></Form.Control></Col>
                        </Row><br/>
                        <Row>
                            <Col><Button variant="outline-primary" size="sm" type="submit">Generate & Encrypt</Button></Col>
                        </Row><br/>
                        <Row>
                            <Col>{this.state.isSubmitting && ( <Spinner animation="grow" element="generateEncryptionKeyForm"></Spinner> )}</Col>
                        </Row>
                    </Form.Group>
                </Form>
                <ListGroup>
                    {this.state.publicKeys.map(pk => <ListGroup.Item key={pk}>{pk}</ListGroup.Item>)}
                </ListGroup>
            </Container>
        )
    }
}

export default GenerateKeysForm;