import firebase from 'firebase'
import CodeError from '../util/CodeError'

function makeUserFromFirebaseUser(firebaseUser: firebase.User): Api.User {
  const user = {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    isAnonymous: firebaseUser.isAnonymous,
  }
  return user
}

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

  async signinAnonymously() {
    return firebase.auth().signInAnonymously()
  },

  async linkEmailAndPasswordAccount(email: string, password: string): Promise<Api.User> {
    const credential = firebase.auth.EmailAuthProvider.credential(email, password)
    const currentUser = firebase.auth().currentUser
    if (currentUser) {
      const fbUser: firebase.User = await currentUser.linkWithCredential(credential)
      return makeUserFromFirebaseUser(fbUser)
    } else {
      throw new CodeError('auth/not-logged-in', 'User is not logged in')
    }
  },

  async logout() {
    return firebase.auth().signOut()
  },

  onAuthStateChange(cb: (user: Api.User|null) => void) {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const userProfile = makeUserFromFirebaseUser(user)
        cb(userProfile)
      } else {
        cb(null)
      }
    })
  }
}