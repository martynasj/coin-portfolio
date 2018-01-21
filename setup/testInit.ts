const firebase = require('firebase')
require('firebase/firestore')

module.exports = () => {
  console.log('initiating tests')
  const config = {
    apiKey: "AIzaSyDQG6iqpElHVdSdBwKk1MJMXIGbQtnaBfc",
    authDomain: "coin-portfolio-testing.firebaseapp.com",
    databaseURL: "https://coin-portfolio-testing.firebaseio.com",
    projectId: "coin-portfolio-testing",
    storageBucket: "coin-portfolio-testing.appspot.com",
    messagingSenderId: "32015562506"
  }
  firebase.initializeApp(config)
}