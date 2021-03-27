import React, { Component } from 'react';
import './App.css';

import firebase from 'firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';



import database from './database'

class App extends Component() {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      user: {
        displayName: null,
        email: null,
        photoUrl: null,
        googleId: null
      }
    }
    uiConfig = {
      signInFlow: "popup",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccess: () => false
      }
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          signedIn: true,
        });
        let currUser = firebase.auth().currentUser;
        this.setState({
          user: {
            displayName: currUser.displayName,
            email: currUser.email,
            photoUrl: currUser.photoUrl,
            googleId: currUser.providerData[0].uid
          }
        });
      }
      else {
        this.setState({
          signedIn: false,
        });
        this.setState({
          user: {
            displayName: null,
            email: null,
            photoUrl: null,
            googleId: null
          }
        });
      }

      this.setUserInLocalStorage(user);
    })
  }

  setUserInLocalStorage = (user) => {
    let localStorage  = window.localStorage;
    localStorage.addItem("displayName", user.displayName);
    localStorage.addItem("email", user.email);
    localStorage.addItem("photoUrl", user.photoUrl);
    localStorage.addItem("googleId", user.googleId);
    localStorage.addItem("signedIn", String(this.state.signedIn));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <body>
          {!this.state.signedIn &&
            <div>
              <div id="welcome">Welcome to Note Global</div>
              <div id="signInPrompt">Please sign in to continue!</div>
              <StyledFirebaseAuth
                uiconfig={this.uiConfig}
                firebaseAuth={firebase.auth()} />
            </div>
          }
        </body>
      </div>
    );
  };
}

export default App;
