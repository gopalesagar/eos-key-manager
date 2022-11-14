import { Component } from "react";
import { Button, Container, ListGroup, Form, Spinner, Row, Col } from 'react-bootstrap';
import constants from '../../utils/Constants';
import KeyManagementUtils from '../../utils/KeyManagementUtils';
import EncryptionUtils from '../../utils/EncryptionUtils';
import DataStorageUtils from '../../utils/DataStorageUtils';
const { generatePrivateKey, getPublicKeyFromPrivate } = KeyManagementUtils;

class GenerateKeysForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pincode: '',
            publicKeys: [],
            isSubmitting: false,
            responseMessage: ''
        }
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    toggleLoader = async () => {
        const status = this.state.isSubmitting ? false : true;
        this.setState({ isSubmitting: status });
    }

    clearExistingData = async () => {
        await DataStorageUtils.clearData();
        this.setState({ publicKeys: [] });
    }

    handleSubmit = async (event) => {
        try {
            let publicKey;
            let publicKeys = [];

            event.preventDefault();
            await this.toggleLoader();
            await this.clearExistingData();

            const encryptionPromises = [];
            for(let i = 1; i <= constants.NUMBER_OF_KEYS; i++) {
                const privateKeyString = await generatePrivateKey();
                publicKey = await getPublicKeyFromPrivate(privateKeyString);
                encryptionPromises.push(await EncryptionUtils.getEncrypted(publicKey, privateKeyString, this.state.pincode));
                publicKeys.push(publicKey);
            }
            const encryptedKeysResponse = await Promise.all(encryptionPromises);

            await DataStorageUtils.saveData('object', encryptedKeysResponse);
            this.setState({ publicKeys, responseMessage: "Keys generated successfully!" });
        } catch (error) {
            this.setState({ responseMessage: error.message })
        } finally {
            await this.toggleLoader();
        }
    }
    
    render() {
        return (
            <Container fluid="md">
                <Form data-testid='generateEncryptionKeyForm' onSubmit={this.handleSubmit} id="generateEncryptionKeyForm">
                    <Form.Group className="mb-6">
                        <Row>
                            <Col><Form.Control data-testid='pincodeInput' size="lg" required placeholder="Enter a code for encryption" name="pincode" type="password" value={this.state.pincode} onChange={this.handleChange}></Form.Control></Col>
                        </Row><br/>
                        <Row>
                            <Col><Button data-testid='submitButton' variant="outline-primary" size="sm" type="submit">Generate & Encrypt</Button></Col>
                        </Row><br/>
                        <Row>
                            <Col>{this.state.isSubmitting && ( <Spinner animation="grow" element="generateEncryptionKeyForm"></Spinner> )}</Col>
                        </Row>
                        <Row>
                            <Col><Form.Label>{ this.state.responseMessage }</Form.Label></Col>
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