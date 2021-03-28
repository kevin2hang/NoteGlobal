import React, { Component } from 'react';

// imports for styling
import './App.css';

// imports for libraries
import firebase from 'firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { BrowserRouter as Router, Route } from "react-router-dom";

// components from component folder
import database from './database'
import NavBar from './components/NavBar';
import SearchCourses from './components/SearchCourses';
import Course from './components/Course'

import ContentGrouping from './components/ContentGrouping';
import UploadNote from './components/UploadNote'

import Logo from './assets/logo512.png';

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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

        if (this.isNewUser(currUser)) {
          database.ref('users/' + this.state.user.googleId + '/').set({
            email: currUser.email,
            displayName: currUser.displayName,
            postedFiles: {},
            superAdmin: false,
            adminCourses: {}
          })
        }
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

  isNewUser = (googleId) => {
    database.ref('users/').on("value", (snapshot) => {
      snapshot.forEach(user => {
        if (user.key == googleId)
          return false;
      })
    });

    return true;
  }

  setUserInLocalStorage = (user) => {
    const localStorage = window.localStorage;
    localStorage.setItem("displayName", user.displayName);
    localStorage.setItem("email", user.email);
    localStorage.setItem("photoUrl", user.photoUrl);
    localStorage.setItem("googleId", user.googleId);
    localStorage.setItem("signedIn", String(this.state.signedIn));
  }

  render() {
    return (
      <div>
        <Router>
          <NavBar />
          {this.state.signedIn ?
            <div id='main-content'>
              <Route exact path="/" component={SearchCourses} />
              <Route exact path="/:school/:course" component={Course} />
              <Route path='/:school/:course/:folderName'
                render={
                  (props) => <ContentGrouping path={`gen/${props.match.params.school}/courses/${props.match.params.course}/notes/`}
                    name={props.match.params.folderName}
                  />
                }
              />
            {/* <Route path="/:school/:course/:folder" component={}/> */}
            {/* <Route path="/user/admin" component={}/> */}
            {/* <Route path="/user/notes" component={}/> */}
            {/* <Route path="/profile" component={Profile}/> */}
          </div>
          :
          <div id='main-content'>
            <img className='logo' src={Logo}/>
            <h1>Note Global</h1>
            <div id="welcome">Welcome to Note Global</div>
            <div id="signInPrompt">Please sign in to continue!</div>
            <StyledFirebaseAuth
              uiConfig={this.uiConfig}
              firebaseAuth={firebase.auth()} />
          </div>
        }
      </Router>
      {this.state.signedIn && <div id="signedInStatus">Signed In &#9989;</div>}
      </div>
    );
  };
}

export default App;
