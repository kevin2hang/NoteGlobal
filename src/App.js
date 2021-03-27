import React, { Component } from 'react';
import './App.css';


import database from './database'

class App extends Component() {
  constructor(props) {
    super(props);

    this.state = {
      signedIn : false,
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <body>

        </body>
      </div>
    );
  };
}

export default App;
