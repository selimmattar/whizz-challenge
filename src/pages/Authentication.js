import React, { Component } from 'react';
import firebase from '../utils/Firebase';
import { Redirect } from 'react-router-dom';
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  TextField,
  Button,
} from '@material-ui/core';
class Authentication extends Component {
  constructor() {
    super();

    this.state = { username: '', password: '', redirect: null };

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

  handleSubmit() {
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
              this.setState({ redirect: 'upload' });
            });
        }
      });
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className='App'>
        <form onSubmit={this.handleSubmit} style={{ flexDirection: 'row' }}>
          <div style={{ margin: 10 }}>
            <TextField
              label='Email'
              variant='outlined'
              name='email'
              value={this.state.username}
              onChange={this.handleChangeUsername}
            />
          </div>
          <div style={{ margin: 10 }}>
            <TextField
              label='Password'
              variant='outlined'
              type='password'
              value={this.state.password}
              onChange={this.handleChangePassword}
            />
          </div>
          <Button onClick={this.handleSubmit}>Log in</Button>
        </form>
      </div>
    );
  }
}

export default Authentication;
