import React, { Component } from 'react';

import firebase from 'firebase'

class SignOut extends Component {

    signOut = () => {
        const localStorage = window.localStorage;
        localStorage.setItem("displayName", null);
        localStorage.setItem("email", null);
        localStorage.setItem("photoUrl", null);
        localStorage.setItem("googleId", null);
        localStorage.setItem("signedIn", String("false"));

        firebase.auth().signOut();
    }
    render() {
        return (
            <div id="signOut">
                <button class="btn btn-danger" id="signOutBtn" onClick={this.signOut}>Sign Out</button>
            </div>
        )
    }
}

export default SignOut;