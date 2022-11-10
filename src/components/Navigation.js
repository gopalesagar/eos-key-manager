import React from 'react';
import Nav from 'react-bootstrap/Nav';

const Navigation = () => {
    return (
        <Nav className="justify-content-center" activeKey="/">
            <Nav.Item>
                <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/sign">Sign Message</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/recover">Recover Public Key</Nav.Link>
            </Nav.Item>
        </Nav>
    );
}

export default Navigation;