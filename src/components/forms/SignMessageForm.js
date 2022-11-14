import React, { Component } from "react";
import { Button, Container, Form, Spinner, Row, Col } from 'react-bootstrap';
import KeyManagementUtils from '../../utils/KeyManagementUtils';
import EncryptionUtils from '../../utils/EncryptionUtils';
import DataStorageUtils from '../../utils/DataStorageUtils';

class SignMessageForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pincode: '',
            message: '',
            isSubmitting: false,
            publicKey: '',
            responseMessage: ''
        }
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    handlePublicKeyOnChange = event => {
        this.setState({ publicKey: event.target.value });
    }

    toggleLoader = async () => {
        const status = this.state.isSubmitting ? false : true;
        this.setState({ isSubmitting: status });
    }

    handleSubmit = async (event) => {
        try {
            await this.toggleLoader();
            event.preventDefault();
            
            const decryptionPromises = [];
            const encryptedKeyPairs = DataStorageUtils.getStoredData('object');

            Object.entries(encryptedKeyPairs).forEach(ekp => {
                decryptionPromises.push(EncryptionUtils.getDecrypted(ekp[0], ekp[1], this.state.pincode));
            });

            const decryptedData = await Promise.all(decryptionPromises);
            
            //TODO: Update to logic to something better
            let privateKey = '';
            decryptedData.forEach(dd => {
                const current = dd[this.state.publicKey]
                if(current) privateKey = current;
            })
            
            const signature = await KeyManagementUtils.signMessage(this.state.message, privateKey);
            this.setState({ responseMessage: `Signature:\n ${signature}`});
        } catch (error) {
            this.setState({ responseMessage: error.message});
        } finally {
            await this.toggleLoader();
        }
    }
    
    render() {
        return (
            <Container style={{ display: 'block', width: 800, padding: 100, wordBreak: "break-all" }}>
                <Form data-testid='signMessageForm' onSubmit={this.handleSubmit} id="signMessageForm">
                    <Form.Group className="mb-6">
                        <Row>
                            <Col><Form.Control data-testid='messageInput' size="lg" type="text" id="message" name="message" value={this.state.message} onChange={this.handleChange} required placeholder="Enter a message to sign" aria-describedby="messageTextArea"/>
                            <Form.Text id="messageTextArea" muted></Form.Text></Col>
                        </Row><br/>
                        <Row>
                            <Col>
                                <Form.Select data-testid='publicKeySelect' size="lg" onChange={this.handlePublicKeyOnChange} required aria-label="Default select example">
                                    <option value="">Select Public Key</option>
                                    { this.props.publicKeys.map(pk => <option key={pk} value={pk}>{pk}</option>) }
                                </Form.Select>
                            </Col>
                        </Row><br/>
                        <Row>
                            <Col><Form.Control data-testid='pincodeInput' size="lg"required placeholder="Enter a code for decryption" name="pincode" type="password" value={this.state.pincode} onChange={this.handleChange}></Form.Control></Col>
                        </Row><br/>
                        <Row>
                            <Col><Button data-testid='submitButton' variant="outline-primary" size="sm" type="submit">Sign Message</Button></Col>
                        </Row><br/>
                        <Row>
                            <Col>{this.state.isSubmitting && ( <Spinner animation="grow" element="signMessageForm"></Spinner> )}</Col>
                        </Row><br/>
                        <Row>
                            <Col><Form.Label>{ this.state.responseMessage }</Form.Label></Col>
                        </Row>
                    </Form.Group>
                </Form>
            </Container>
        )
    }
}

export default SignMessageForm;