import firebase from 'firebase'
import hash from '../util/hash'

type Unsubscribe = () => void

export async function createNewPortfolio(slug: string): Promise<string> {
  const db = firebase.firestore()
  await db.collection('portfolios').doc(slug).set({
    name: slug,
  })
  return slug
}

function syncPortfolioItems(
  slug: string,
  callback: (portfolioItems: Api.PortfolioItem[]) => void
): Unsubscribe {
  const db = firebase.firestore()
  return db.collection('portfolios').doc(slug).collection('items').onSnapshot(snap => {
    let items: Api.PortfolioItem[] = []
    snap.forEach(doc => {
      const portfolioItem = {
        id: doc.id,
        ...doc.data()
      } as Api.PortfolioItem
      items.push(portfolioItem)
    })
    callback(items)
  })
}

function syncPortfolio(
  slug: string,
  callback: (portfolio: Api.PortfolioOnly|null) => void
): Unsubscribe {
  const db = firebase.firestore()

  return db.collection('portfolios').doc(slug).onSnapshot(doc => {
    if (!doc.exists) {
      callback(null)
    }
    const portfolio = {
      id: doc.id,
      ...doc.data() as any,
    }

    callback(portfolio as Api.PortfolioOnly)
  }, err => {
    console.log(err)
    callback(null)
  })
}

export function syncPortfolioWithItems(
  slug: string,
  callback: (portfolioWithItems: Api.Portfolio|null) => void
): Unsubscribe {
  let portfolio: Api.Portfolio|null = null

  const unsubPortfolio = syncPortfolio(slug, apiPortfolio => {
    if (apiPortfolio) {
      if (portfolio) {
        Object.assign(portfolio, apiPortfolio)
      } else {
        portfolio = {
          ...apiPortfolio,
          items: [],
        }
      }
      callback(portfolio)
    } else {
      portfolio = null
    }
  })

  const unsubPortfolioItems = syncPortfolioItems(slug, items => {
    if (portfolio) {
      portfolio.items = items
      callback(portfolio)
    }
  })

  return () => {
    unsubPortfolio()
    unsubPortfolioItems()
  }
}

export function addLock(slug: string, passcode: string) {
  const db = firebase.firestore()
  const hashed = hash(passcode)
  db.collection('portfolios').doc(slug).update({
    lock: hashed,
  })
}

export function addItem(slug: string, apiItem: Api.PortfolioItemNew) {
  const db = firebase.firestore()
  db.collection('portfolios').doc(slug).collection('items').add(apiItem)
}

export function deleteItem(slug: string, itemId: string) {
  const db = firebase.firestore()
  db.collection('portfolios').doc(slug).collection('items').doc(itemId).delete()
}

export function updateItem(slug: string, itemId: string, editOptions: Api.PortfolioItemEdit) {
  const db = firebase.firestore()
  db.collection('portfolios').doc(slug).collection('items').doc(itemId).update(editOptions)
}