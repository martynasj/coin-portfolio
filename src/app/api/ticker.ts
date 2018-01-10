import firebase from 'firebase'

export async function getTicker(symbol: string): Promise<Api.Ticker> {
  const db = firebase.firestore!()
  try {
    const doc = await db.collection('tickers').doc(symbol).get()
    if (doc.exists) {
      return doc.data() as Api.Ticker
    } else {
      throw new Error(`Ticker for symbol ${symbol} not found`)
    }
  } catch (err) {
    throw err
  }
}

type Callback = (ticker: Api.Ticker|null) => void
type Unsubscribe = () => void

export function syncTicker(symbol: string, callback: Callback): Unsubscribe {
  const db = firebase.firestore!()
  return db.collection('tickers').doc(symbol).onSnapshot(doc => {
    if (!doc.exists) {
      callback(null)
    }
    const ticker = {
      ...doc.data(),
      id: doc.id,
    } as Api.Ticker
    callback(ticker)
  }, err => {
    console.log(err)
    callback(null)
  })
}

