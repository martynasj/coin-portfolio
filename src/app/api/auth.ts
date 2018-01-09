import firebase from 'firebase'

export async function addLock(slug, hash: string) {
  const db = firebase.firestore()
  const portfolio = await db.collection('portfolios').doc(slug).get()
  if (portfolio.exists) {
    // const data =
  }
  // db.collection('portfolios').doc(slug).set()
}