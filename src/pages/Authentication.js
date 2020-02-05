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
  Dialog,
  CircularProgress,
} from '@material-ui/core';
class Authentication extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      redirect: null,
      username_error: false,
      password_error: false,
      username_ht: '',
      password_ht: '',
      DialogOpen: false,
    };

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChangeUsername(event) {
    this.setState({ username: event.target.value });
    if (this.validateEmail(event.target.value)) {
      this.setState({
        username_error: false,
        username_ht: '',
      });
    }
  }
  handleChangePassword(event) {
    this.setState({ password: event.target.value });
    if (event.target.value.length >= 6) {
      this.setState({
        password_error: false,
        password_ht: '',
      });
    }
  }

  handleSubmit() {
    this.setState({ DialogOpen: true });
    console.log('username ' + this.state.username);
    console.log('password ' + this.state.password);
    const { username, password } = this.state;
    if (username == '') {
      this.setState({ username_error: true, DialogOpen: false });
      return;
    }
    if (password == '') {
      this.setState({ password_error: true, DialogOpen: false });
      return;
    }
    if (!this.validateEmail(username)) {
      this.setState({
        username_error: true,
        username_ht: 'invalid email',
        DialogOpen: false,
      });

      return;
    }
    if (password.length < 6) {
      this.setState({
        password_error: true,
        password_ht: 'invalid password',
        DialogOpen: false,
      });

      return;
    }
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.username, this.state.password)
      .then(response => {
        console.log('logged in!');
        console.log('userId', response.user.uid);
        this.setState({ redirect: 'upload' });
      })
      .catch(error => {
        console.log(error.code);
        if (error.code == 'auth/user-not-found')
          this.setState({
            username_error: true,
            username_ht: 'invalid email',
            DialogOpen: false,
          });
        else if (error.code == 'auth/wrong-password')
          this.setState({
            password_error: true,
            password_ht: 'invalid password',
            DialogOpen: false,
          });
      });
    /*firebase
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
      });*/
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className='App'>
        <Dialog
          fullWidth={true}
          open={this.state.DialogOpen}
          aria-labelledby='max-width-dialog-title'
        ></Dialog>
        <form onSubmit={this.handleSubmit} style={{ flexDirection: 'row' }}>
          <div style={{ margin: 10 }}>
            <TextField
              error={this.state.username_error}
              label='Email'
              variant='outlined'
              name='email'
              value={this.state.username}
              onChange={this.handleChangeUsername}
              helperText={this.state.username_ht}
            />
          </div>
          <div style={{ margin: 10 }}>
            <TextField
              error={this.state.password_error}
              label='Password'
              variant='outlined'
              type='password'
              value={this.state.password}
              onChange={this.handleChangePassword}
              helperText={this.state.password_ht}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Button onClick={this.handleSubmit}>Log in</Button>
            {this.state.DialogOpen && (
              <CircularProgress
                style={{
                  color: '#000000',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: -20,
                  marginLeft: -20,
                }}
              ></CircularProgress>
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default Authentication;
