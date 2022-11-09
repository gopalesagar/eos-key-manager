import React from 'react';

import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <div>
            <NavLink to="/">Generate Keys</NavLink>
            <NavLink to="/sign">Sign Message</NavLink>
            <NavLink to="/recover">Recover Public Key</NavLink>
        </div>
    );
}

export default Navigation;