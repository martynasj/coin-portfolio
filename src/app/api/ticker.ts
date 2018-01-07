import _ from 'lodash'
import firebase from 'firebase'

export async function getTicker(symbol: string): Promise<Api.Ticker> {
  const db = firebase.firestore()
  try {
    const doc = await db.collection('tickers').doc(symbol).get()
    if (doc.exists) {
      return {
        id: doc.id,
        ...doc.data() as Api.Ticker,
      }
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
  const db = firebase.firestore()
  return db.collection('tickers').doc(symbol).onSnapshot(doc => {
    if (!doc.exists) {
      callback(null)
    }
    
    callback(doc.data() as Api.Ticker)
  }, err => {
    console.log(err)
    callback(null)
  })
}

