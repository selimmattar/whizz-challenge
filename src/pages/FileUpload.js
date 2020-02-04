import React, { Component } from 'react';
import firebase from '../utils/Firebase';
import axios, { post } from 'axios';
import { Redirect } from 'react-router-dom';
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
} from '@material-ui/core';
import Dropzone from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
function generate(element) {
  return [0, 1, 2].map(value =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}
class FileUpload extends Component {
  constructor() {
    super();
    this.onDrop = files => {
      this.setState({ files });
    };
    this.state = {
      files: [],
      filesIds: [],
      grade: '',
      name: '',
      subject: '',
      redirect: null,
    };

    this.handleChangeFiles = this.handleChangeFiles.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeGrade = this.handleChangeGrade.bind(this);
    this.handleChangeSubject = this.handleChangeSubject.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (!firebase.auth().currentUser) this.setState({ redirect: '' });
  }

  handleChangeFiles(event) {
    var files = this.state.files;
    files.push(event.target.value);
    console.log(files.length);
    console.log(files[0]);
    files.forEach(element => console.log(element));
    this.setState({ files });
  }
  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }
  handleChangeGrade(event) {
    this.setState({ grade: event.target.value });
  }
  handleChangeSubject(event) {
    this.setState({ subject: event.target.value });
  }

  handleSubmit(event) {
    var files = this.state.files;
    files.forEach(element => console.log(element));
    const formData = new FormData();
    formData.append('file0', files[0]);
    var token = firebase.auth().currentUser.refreshToken;
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };
    console.log('aaaaaaaaaaaaaaaaaaaa');
    console.log('user', firebase.auth().currentUser.toJSON());
    console.log(
      'access token ',
      firebase.auth().currentUser.toJSON().stsTokenManager.refreshToken,
    );
    firebase
      .auth()
      .currentUser.getIdTokenResult()
      .then(response => {
        console.log('token : ', response.token);
        token = response.token;
        console.log('id token ', token);
      });
    /*firebase
      .auth()
      .currentUser.getIdTokenResult()
      .then(response => {
        console.log('token : ', response.token);
        token = response.token;
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        };
        axios
          .post(
            'https://api.whizz.app/api/v1/client/document/upload',
            formData,
            config,
          )
          .then(function(response) {
            console.log('file uploaded');
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
            console.log(error.message);
          });
      });*/
    /*axios
      .post('https://api.whizz.app/api/v1/client/user/get')
      .then(function(response) {
        console.log('file uploaded');
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
        console.log(error.message);
      });*/

    event.preventDefault();
  }

  render() {
    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));
    const dropzoneStyle = {
      width: '20%',
      height: '150px',
      border: '1px solid black',
    };
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className='App'>
        <List>
          {generate(
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary='Single-line item'
                secondary='Secondary text'
              />
              <ListItemSecondaryAction>
                <IconButton edge='end' aria-label='delete'>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>,
          )}
        </List>
        <form onSubmit={this.handleSubmit}>
          <Dropzone onDrop={this.onDrop} style={dropzoneStyle}>
            {({ getRootProps, getInputProps }) => (
              <section className='container'>
                <div {...getRootProps({ className: 'dropzone' })}>
                  <Paper style={{ padding: 50 }}>
                    <input {...getInputProps()} />

                    <p>
                      Drag and drop some files here, or click to select files
                    </p>
                  </Paper>
                </div>

                <aside>
                  <h4>Files</h4>
                  <ul>{files}</ul>
                </aside>
              </section>
            )}
          </Dropzone>
          {files.length > 0 && (
            <div>
              <div style={{ margin: 10 }}>
                <TextField
                  label='grade'
                  variant='outlined'
                  name='grade'
                  type='number'
                  value={this.state.grade}
                  onChange={this.handleChangeGrade}
                />
              </div>

              <div style={{ margin: 10 }}>
                <TextField
                  label='name'
                  variant='outlined'
                  value={this.state.name}
                  onChange={this.handleChangeName}
                />
              </div>
              <div style={{ margin: 10 }}>
                <TextField
                  label='subject'
                  variant='outlined'
                  value={this.state.subject}
                  onChange={this.handleChangeSubject}
                />
              </div>

              <Button onClick={this.handleSubmit}>Upload</Button>
            </div>
          )}
        </form>
      </div>
    );
  }
}

export default FileUpload;