import React, { Component } from "react";
import { Button, Container, Form, Spinner, Row, Col } from 'react-bootstrap';
import { getStoredData, getDecrypted, getPrivateKeyFromString, signMessage } from '../../utils';

class SignMessageForm extends Component {

    constructor(props) {
        super(props);
        console.log('PROPS: ', props);
        this.state = {
            pincode: '',
            message: '',
            isSubmitting: false,
            errorOccurred: false,
            publicKey: ''
        }
    }

    handlePincode = event => {
        this.setState({ pincode: event.target.value });
    }

    handleMessage = event => {
        this.setState({ message: event.target.value });
    }

    handlePublicKeyOnChange = event => {
        this.setState({ publicKey: event.target.value });
    }

    toggleLoader = async () => {
        const status = this.state.isSubmitting ? false : true;
        this.setState({ isSubmitting: status });
    }

    handleSubmit = async (event) => {
        await this.toggleLoader();
        event.preventDefault();
        
        const decryptionPromises = [];
        const encryptedKeyPairs = getStoredData('object');

        Object.entries(encryptedKeyPairs).forEach(ekp => {
            decryptionPromises.push(getDecrypted(ekp[0], ekp[1], this.state.pincode));
        });

        // TODO: Add public keys to state
        const decryptedData = await Promise.all(decryptionPromises);
        console.log('DECRYPTED DATA: ', decryptedData);

        const signature = await signMessage(this.state.message, decryptedData[this.state.publicKey]);
        console.log('SIGNATURE:', signature);
        
        await this.toggleLoader();
    }
    
    render() {
        return (
            <Container style={{ display: 'block', width: 700, padding: 30 }}>
                <Form onSubmit={this.handleSubmit} id="signMessageForm">
                    <Form.Group className="mb-6">
                        <Row>
                            <Col><Form.Label>Message: </Form.Label></Col>
                            <Col><Form.Control required placeholder="Enter a message to sign" value={this.state.message} onChange={this.handleMessage}></Form.Control></Col>
                        </Row><br/>
                        <Row>
                            <Col><Form.Label>Public Key: </Form.Label></Col>
                            <Col>
                                <Form.Select onChange={this.handlePublicKeyOnChange} required aria-label="Default select example">
                                    <option>Open this select menu</option>
                                    { this.props.publicKeys.map(pk => <option value={pk}>{pk}</option>) }
                                </Form.Select>
                            </Col>
                        </Row><br/>
                        <Row>
                            <Col><Form.Label>Pincode: </Form.Label></Col>
                            <Col><Form.Control required placeholder="Enter a code for encryption" value={this.state.pincode} onChange={this.handlePincode}></Form.Control></Col>
                        </Row><br/>
                        <Row>
                            <Col><Button variant="outline-primary" size="sm" type="submit">Sign Message</Button></Col>
                        </Row><br/>
                        <Row>
                            <Col>{this.state.isSubmitting && ( <Spinner animation="grow" element="signMessageForm"></Spinner> )}</Col>
                        </Row>
                    </Form.Group>
                </Form>
            </Container>
        )
    }
}

export default SignMessageForm;