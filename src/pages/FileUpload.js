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
  Dialog,
  CircularProgress,
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
import { green } from 'color-name';

class FileUpload extends Component {
  constructor() {
    super();
    this.onDrop = files => {
      var newFiles = this.state.files;
      files.forEach(el => newFiles.push(el));
      this.setState({ files: newFiles, successMsg: false });
    };
    this.state = {
      files: [],
      filesIds: [],
      grade: '',
      name: '',
      subject: '',
      redirect: null,
      DialogOpen: false,
      uploadBtnColor: '',
      uploadBtnTextColor: '',
      grade_error: false,
      name_error: false,
      subject_error: false,
      successMsg: false,
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
    this.setState({
      files,
      successMsg: false,
    });
  }
  handleChangeName(event) {
    this.setState({
      name: event.target.value,
      name_error: false,
    });
  }
  handleChangeGrade(event) {
    this.setState({
      grade: event.target.value,
      grade_error: false,
    });
  }
  handleChangeSubject(event) {
    this.setState({
      subject: event.target.value,
      subject_error: false,
    });
  }
  async uploadfiles(el, config) {
    const formData = new FormData();
    formData.append('file0', el);

    return axios
      .post(
        'https://staging.api.whizz.app/api/v1/client/document/upload',
        formData,
        config,
      )
      .then(response => {
        console.log('file uploaded');
        console.log('response ', response);
        console.log('response data ', response.data);
        var fileId = response.data;
        var filesIds = this.state.filesIds;
        filesIds.push(fileId);
        this.setState({ filesIds });
        var files = this.state.files;
        var newfiles = files.filter(old_el => {
          return el.name !== old_el.name;
        });
        this.setState({ files: newfiles });
      })
      .catch(function(error) {
        console.log(error);
        console.log(error.message);
      });
  }
  async addDocument(token) {
    const { filesIds, grade, name, subject } = this.state;
    axios
      .post('https://staging.api.whizz.app/api/v1/client/document/add', null, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        params: {
          files: filesIds,
          grade: grade,
          name: name,
          subject: subject,
        },
      })
      .then(response => {
        console.log('document add response ', response);
      })
      .catch(error => {
        console.log('document add error ', error);
      });
  }
  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
  handleSubmit(event) {
    const { grade, subject, name } = this.state;
    if (grade == '') {
      this.setState({ grade_error: true });
      return;
    }
    if (name == '') {
      this.setState({ name_error: true });
      return;
    }
    if (subject == '') {
      this.setState({ subject_error: true });
      return;
    }
    this.setState({ DialogOpen: true });
    firebase
      .auth()
      .currentUser.getIdToken()
      .then(async response => {
        console.log('token : ', response);
        var token = response;
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        };
        var files = this.state.files;
        const startUpload = async () => {
          await this.asyncForEach(files, async el => {
            await this.uploadfiles(el, config);
            console.log(el);
          });
          console.log('it is over!!!');
          const { filesIds, grade, name, subject } = this.state;
          axios
            .post(
              'https://staging.api.whizz.app/api/v1/client/document/add',
              null,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}`,
                },
                params: {
                  files: filesIds,
                  grade: grade,
                  name: name,
                  subject: subject,
                },
              },
            )
            .then(response => {
              console.log('document add response ', response);
              this.setState({
                DialogOpen: false,
                uploadBtnColor: '#5cd65c',
                uploadBtnTextColor: '#FFFFFF',
                successMsg: true,
              });
            })
            .catch(error => {
              console.log('document add error ', error);
            });
        };
        startUpload();
      });

    event.preventDefault();
  }
  deletefile(name) {
    var files = this.state.files;
    files = files.filter(el => {
      return el.name !== name;
    });
    this.setState({ files, uploadBtnColor: '', uploadBtnTextColor: '' });
  }

  render() {
    const files = this.state.files.map(file => (
      <ListItem key={file.name}>
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={file.name} secondary={`${file.size} bytes`} />
        <ListItemSecondaryAction>
          <IconButton
            onClick={() => this.deletefile(file.name)}
            edge='end'
            aria-label='delete'
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
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
      <div className='App' style={{ flex: 1, justifyContent: 'center' }}>
        <Dialog
          fullWidth={true}
          open={this.state.DialogOpen}
          aria-labelledby='max-width-dialog-title'
        ></Dialog>
        <Dropzone onDrop={this.onDrop}>
          {({ getRootProps, getInputProps }) => (
            <section className='container'>
              <div {...getRootProps({ className: 'dropzone' })}>
                <Paper style={{ padding: 50 }}>
                  <input {...getInputProps()} />

                  <p>Drag and drop some files here, or click to select files</p>
                </Paper>
              </div>

              <aside>
                <h4>Files</h4>

                <List>{files}</List>
              </aside>
            </section>
          )}
        </Dropzone>
        {this.state.successMsg && (
          <h5>Your files have been successfully uploaded!</h5>
        )}
        {this.state.files.length > 0 && (
          <div>
            <div style={{ margin: 10 }}>
              <TextField
                error={this.state.grade_error}
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
                error={this.state.name_error}
                label='name'
                variant='outlined'
                value={this.state.name}
                onChange={this.handleChangeName}
              />
            </div>
            <div style={{ margin: 10 }}>
              <TextField
                error={this.state.subject_error}
                label='subject'
                variant='outlined'
                value={this.state.subject}
                onChange={this.handleChangeSubject}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Button onClick={this.handleSubmit}>Upload</Button>
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
          </div>
        )}
      </div>
    );
  }
}

export default FileUpload;
