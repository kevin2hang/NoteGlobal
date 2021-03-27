import React, { Component } from 'react';

import { Link } from 'react-router-dom';


class NavBar extends Component {
    render() {
        return(
            <div id="navBar">
                <Link to="/">Note Global</Link>
                <Link to="/user/admin">Privileges</Link>
                <Link to="/user/notes">Uploaded Notes</Link>
                <Link to="/profile">Profile</Link>
            </div>
        );
    }
}

export default NavBar;