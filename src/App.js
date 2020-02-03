import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';

var firebaseConfig = {
  apiKey: 'AIzaSyDDsWTQ_c5e2q_Wv6nEggart376-qbjfgI',
  authDomain: 'whizz-staging-e7882.firebaseapp.com',
  databaseURL: 'https://whizz-staging-e7882.firebaseio.com',
  projectId: 'whizz-staging-e7882',
  storageBucket: 'whizz-staging-e7882.appspot.com',
  messagingSenderId: '987649722663',
  appId: '1:987649722663:web:5b7dd885a2feebd92b0102',
  measurementId: 'G-552L21MRV3',
};

class App extends Component {
  constructor() {
    super();
    if (firebase.apps.length == 0) {
      firebase.initializeApp(firebaseConfig);
    }
    this.state = { username: '', password: '' };

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChangeUsername(event) {
    this.setState({ username: event.target.value });
  }
  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }
  handleSubmit(event) {
    console.log('username ' + this.state.username);
    console.log('password ' + this.state.password);
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.username, this.state.password)
      .then(response => {
        console.log('Signup successful.');
        console.log('userId', response.user.uid);
        this.setState({
          response: 'Account Created!',
        });
      })
      .catch(error => {
        console.log(error.code);
        console.log(error.message);
        if (error.code == 'auth/email-already-in-use') {
          firebase
            .auth()
            .signInWithEmailAndPassword(
              this.state.username,
              this.state.password,
            )
            .then(response => {
              console.log('logged in!');
              console.log('userId', response.user.uid);
            });
        }
      });
    event.preventDefault();
  }
  render() {
    return (
      <div className='App'>
        <form onSubmit={this.handleSubmit}>
          <label>
            Nom :
            <input
              type='text'
              name='name'
              value={this.state.value}
              onChange={this.handleChangeUsername}
            />
          </label>
          <label>
            password :
            <input
              type='password'
              name='password'
              value={this.state.value}
              onChange={this.handleChangePassword}
            />
          </label>
          <input type='submit' value='Envoyer' />
        </form>
      </div>
    );
  }
}

export default App;
