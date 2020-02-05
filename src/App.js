import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Authentication from './pages/Authentication';
import FileUpload from './pages/FileUpload';
import whizzLogo from './whizz-Icon.png';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <div className='Icon-header'>
          <img src={whizzLogo} alt='Logo' width='150'></img>
        </div>
        <div className='App-header'>
          <Router>
            <Switch>
              <Route exact path='/' component={Authentication} />
              <Route path='/upload' component={FileUpload} />
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
