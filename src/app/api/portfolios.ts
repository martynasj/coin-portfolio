import firebase from 'firebase'

type Callback = (portfolio: Api.Portfolio|null) => void
type Unsubscribe = () => void

export function syncPortfolio(slug: string, callback: Callback): Unsubscribe {
  const db = firebase.firestore()
  return db.collection('portfolios').doc(slug).onSnapshot(doc => {
    if (!doc.exists) {
      callback(null)
    }
    const portfolio = {
      id: doc.id,
      ...doc.data()
    }
    callback(portfolio as Api.Portfolio)
  }, err => {
    console.log(err)
    callback(null)
  })
}