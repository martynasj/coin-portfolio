import firebase from 'firebase'

export default {
  async signupWithEmailAndPassword(email: string, password: string) {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password)
      firebase.firestore()
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

  onAuthStateChange(cb: (user: Api.User|null) => void) {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const userProfile: Api.User = {
          id: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          isAnonymous: user.isAnonymous,
        }
        cb(userProfile)
      } else {
        cb(null)
      }
    })
  }
}