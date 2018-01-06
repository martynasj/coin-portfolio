import * as _ from 'lodash'
import * as firebase from 'firebase'

interface Ticker {
  id: string
  symbol: string
  name: string
  priceUSD: number
}

export async function getTicker(symbol: string) {
  const db = firebase.firestore()
  const snap = await db.collection('tickers').get()
  snap.forEach(doc => {
    console.log({ id: doc.id, data: doc.data() })
  })
}