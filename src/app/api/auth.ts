import firebase from 'firebase'

export default {
  async signupWithEmailAndPassword(email: string, password: string) {
    try {
      const user = await firebase.auth().createUserWithEmailAndPassword(email, password)
      const db = firebase.firestore()
      // todo: set portfolios collection
      db.collection('users').doc(user.uid).set({
        displayName: user.displayName || 'bbs'
      })
    } catch (err) {
      throw err
    }
  },

  async signinWithEmailAndPassword(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },

  async logout() {
    return firebase.auth().signOut()
  },

  onAuthStateChange(cb: (any) => void) {
    firebase.auth().onAuthStateChanged(user => {
      // todo: also sync user from db
      if (user) {
        cb(user)
      } else {
        cb(null)
      }
    })
  }
}