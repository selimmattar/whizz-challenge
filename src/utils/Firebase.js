import React, { Component } from 'react';
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
firebase.initializeApp(firebaseConfig);

export default firebase;
