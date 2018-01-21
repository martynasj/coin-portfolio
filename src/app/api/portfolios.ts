import firebase from 'firebase'
import hash from '../util/hash'

type Unsubscribe = () => void

const timestamp = () => firebase.firestore.FieldValue.serverTimestamp()

export async function isAvailable(slug: string): Promise<boolean> {
  if (!slug) {
    return false
  }
  const db = firebase.firestore()
  const portfolio = await db.collection('portfolios').doc(slug).get()
  return !portfolio.exists
}

interface CreateNewPortfolioOptions {
  ownerId: string
}

export async function createNewPortfolio(slug: string, options: CreateNewPortfolioOptions): Promise<string> {
  const db = firebase.firestore!()
  await db.collection('portfolios').doc(slug).set({
    name: slug,
    ownerId: options.ownerId,
  })
  return slug
}

export async function fetchPortfolio(slug: string): Promise<Api.PortfolioOnly> {
  const db = firebase.firestore!()
  const ref = await db.collection('portfolios').doc(slug).get()
  return {
    ...ref.data(),
    id: ref.id,
  } as Api.PortfolioOnly
}

function syncPortfolioItems(
  slug: string,
  callback: (portfolioItems: Api.PortfolioItem[]) => void
): Unsubscribe {
  const db = firebase.firestore!()
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
  }, err => {
    console.log(err)
  })
}

function syncPortfolio(
  slug: string,
  callback: (portfolio: Api.PortfolioOnly|null) => void
): Unsubscribe {
  const db = firebase.firestore!()

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
  let unsubItems: Unsubscribe

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

      unsubItems = unsubItems || syncPortfolioItems(slug, items => {
        portfolio!.items = items
        callback(portfolio)
      })

      callback(portfolio)
    } else {
      portfolio = null
    }
  })

  return () => {
    unsubPortfolio()
    unsubItems()
  }
}

export function syncUserPortfolios(
  userId: string,
  callback: (portfolios: Api.PortfolioOnly[]) => void,
  errCallback?: (err: any) => void,
): Unsubscribe {
  const db = firebase.firestore()
  const unsub = db.collection('portfolios').where('ownerId', '==', userId).onSnapshot(snap => {
    const portfolios: Api.PortfolioOnly[] = []
    snap.forEach(doc => {
      const portfolio: Api.PortfolioOnly = {
        ...doc.data() as any,
        id: doc.id,
      }
      portfolios.push(portfolio)
    })
    callback(portfolios)
  }, err => {
    errCallback && errCallback(err)
  })
  return unsub
}

export function addLock(slug: string, passcode: string) {
  const db = firebase.firestore!()
  const hashed = hash(passcode)
  db.collection('portfolios').doc(slug).update({
    lock: hashed,
  })
}

export function addItem(slug: string, apiItem: Api.PortfolioItemNew) {
  const db = firebase.firestore!()
  db.collection('portfolios').doc(slug).collection('items').add({
    ...apiItem,
    createdAt: timestamp(),
  })
}

export function deleteItem(slug: string, itemId: string) {
  const db = firebase.firestore!()
  db.collection('portfolios').doc(slug).collection('items').doc(itemId).delete()
}

export function updateItem(slug: string, itemId: string, editOptions: Api.PortfolioItemEdit) {
  const db = firebase.firestore!()
  db.collection('portfolios').doc(slug).collection('items').doc(itemId).update({
    ...editOptions,
    updatedAt: timestamp(),
  })
}