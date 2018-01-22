const firebase = require('firebase')
require('firebase/firestore')

module.exports.initFirebase = function() {
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

module.exports.cleanFirebase = function() {
  const db = firebase.firestore()
  return Promise.all([
    'portfolios',
    'tickers',
    'users',
  ].map(path => deleteCollection(db, path)))
}

function deleteCollection(db, path) {
  return db.collection(path).get()
    .then(snap => {
      const batch = db.batch()
      snap.docs.forEach(function(doc) {
          batch.delete(doc.ref)
      })
      return batch.commit()
    })
}