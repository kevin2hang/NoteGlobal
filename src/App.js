import React, { Component } from 'react';

// imports for styling
import './App.css';

// imports for libraries
import firebase from 'firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { BrowserRouter as Router, Route } from "react-router-dom";

// components from component folder
import database from './database'
import SignOut from './components/SignOut';
import NavBar from './components/NavBar'

class App extends Component {
  constructor() {
    super();

    this.state = {
      signedIn: false,
      user: {
        displayName: null,
        email: null,
        photoUrl: null,
        googleId: null
      }
    }
    this.uiConfig = {
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
            photoUrl: currUser.photoURL,
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

      this.setUserInLocalStorage(this.state.user);
    })
  }

  setUserInLocalStorage = (user) => {
    const localStorage = window.localStorage;
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
          <Router>
          {!this.state.signedIn &&
            <div>
              <div id="welcome">Welcome to Note Global</div>
              <div id="signInPrompt">Please sign in to continue!</div>
              <StyledFirebaseAuth
                uiConfig={this.uiConfig}
                firebaseAuth={firebase.auth()} />
            </div>
          }
          {this.state.signedIn &&
            <div>
              <NavBar/>
              {/* <Route path="/" component={}/>
              <Route path="/:school/:course" component={}/>
              <Route path="/:school/:course/:folder" component={}/>
              <Route path="/user/admin" component={}/>
              <Route path="/user/notes" component={}/>
              <Route path="/profile" component={Profile}/> */}
              <div>Signed In!</div>
              <SignOut />
            </div>
          }
          </Router>
        </body>
      </div>
    );
  };
}

export default App;
