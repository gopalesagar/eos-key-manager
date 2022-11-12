import React, { Component } from "react";
import { Button, Container, Form, Spinner, Row, Col } from 'react-bootstrap';
import KeyManagementUtils from '../../utils/KeyManagementUtils';

class RecoverPublicKeyForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            signature: '',
            message: '',
            isSubmitting: false,
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
            const publicKey = await KeyManagementUtils.recoverPublicKey(this.state.signature, this.state.message);
            this.setState({ responseMessage: `Recovered public key is ${publicKey}`});
        } catch (error) {
            this.setState({ responseMessage: error.message});
        } finally {
            await this.toggleLoader();
        }
    }
    
    render() {
        return (
            <Container style={{ display: 'block', width: 800, padding: 100 }}>
                <Form onSubmit={this.handleSubmit} id="recoverPublicKeyForm">
                    <Form.Group className="mb-6">
                        <Row>
                            <Col><Form.Control type="text" name="message" id="message" value={this.state.message} onChange={this.handleChange} required placeholder="Enter message" aria-describedby="messageTextArea"/>
                            <Form.Text id="messageTextArea" muted></Form.Text></Col>
                        </Row><br/>
                        <Row>
                            <Col><Form.Control required placeholder="Enter the signature" name="signature" value={this.state.signature} onChange={this.handleChange}></Form.Control></Col>
                        </Row><br/>
                        <Row>
                            <Col><Button variant="outline-primary" size="sm" type="submit">Recover</Button></Col>
                        </Row><br/>
                        <Row>
                            <Col>{this.state.isSubmitting && ( <Spinner animation="grow" element="recoverPublicKeyForm"></Spinner> )}</Col>
                        </Row>
                        <Row>
                            <Col><Form.Label>{ this.state.responseMessage }</Form.Label></Col>
                        </Row>
                    </Form.Group>
                </Form>
            </Container>
        )
    }
}

export default RecoverPublicKeyForm;