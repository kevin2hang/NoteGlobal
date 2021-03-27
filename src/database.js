import firebase from 'firebase'


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD8J2m3lnDU9RbbGrNIIjKNuMzg_c0GIMc",
    authDomain: "note-global.firebaseapp.com",
    projectId: "note-global",
    storageBucket: "note-global.appspot.com",
    messagingSenderId: "855847169685",
    appId: "1:855847169685:web:4b1b99248940e70feb359c",
    measurementId: "G-XY7FRZXMQE"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

export default database;