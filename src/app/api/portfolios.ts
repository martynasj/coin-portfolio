import firebase from 'firebase'

type Unsubscribe = () => void

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