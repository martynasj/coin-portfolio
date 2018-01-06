import * as firebase from 'firebase'
import 'firebase/firestore'

const config = {
  apiKey: "AIzaSyDSoUung-soL7F4H1BoxZaJLeYbkEBozxk",
  authDomain: "shit-coin-portfolio.firebaseapp.com",
  databaseURL: "https://shit-coin-portfolio.firebaseio.com",
  projectId: "shit-coin-portfolio",
  storageBucket: "shit-coin-portfolio.appspot.com",
  messagingSenderId: "122681566251"
}

export function initFirebase() {
  firebase.initializeApp(config)
}