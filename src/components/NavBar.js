import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

import SignOut from './SignOut';
import { isSignedIn } from './localStorageFunctions';

class NavBar extends Component {
    render() {
        return(
            <div id="navbar" className="navbar navbar-expand-lg navbar-light fixed-top" style={{backgroundColor: '#e3f2fd'}}>
                <Link to="/">Note Global</Link>
                <Link to="/user/admin">Privileges</Link>
                <Link to="/user/notes">Uploaded Notes</Link>
                <Link to="/upload">Upload</Link>
                <Link to="/profile">Profile</Link>
                {isSignedIn() && <SignOut />}
            </div>
        );
    }
}

export default NavBar;