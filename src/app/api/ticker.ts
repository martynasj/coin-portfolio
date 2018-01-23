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

function isExpired(time: number, expiresTime: number) {
  if (!time || !expiresTime) {
    return true
  }
  return time >= expiresTime
}

export function fetchTickers(): Promise<Api.Ticker[]> {
  const cached = localStorage.getItem('api_tickers')
  const cacheExpires = localStorage.getItem('api_tickers_expires') || ''

  // Expensive api call, so better cache it
  if (cached && !isExpired(new Date().getTime(), parseFloat(cacheExpires))) {
    return Promise.resolve(JSON.parse(cached))
  }

  const db = firebase.firestore!()
  return db.collection('tickers').get().then(querySnapshot => {
    const tickers = querySnapshot.docs.map(doc => {
      return {
        ...doc.data(),
        id: doc.id,
      }
    }) as Api.Ticker[]

    localStorage.setItem('api_tickers', JSON.stringify(tickers))
    const expires = new Date().getTime() + 24 * 60 * 60 * 1000  // add 1 day
    localStorage.setItem('api_tickers_expires', expires.toString())

    return tickers
  }, err => {
    console.log(err)
    throw err
  })
}

