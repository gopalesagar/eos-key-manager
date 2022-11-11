import React from 'react';
import { Nav } from 'react-bootstrap';

const Navigation = () => {
    return (

        <Nav justify activeKey="/">
            <Nav.Item>
                <h4><Nav.Link href="/">Home</Nav.Link></h4>
            </Nav.Item>
            <Nav.Item>
                <h4><Nav.Link href="/sign">Sign Message</Nav.Link></h4>
            </Nav.Item>
            <Nav.Item>
                <h4><Nav.Link href="/recover">Recover Public Key</Nav.Link></h4>
            </Nav.Item>
        </Nav>
    );
}

export default Navigation;