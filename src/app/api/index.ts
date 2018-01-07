import { initFirebase } from './setup'
import { getTicker, syncTicker } from './ticker'
import { syncPortfolioWithItems, addItem, deleteItem, updateItem } from './portfolios'

export const ApiService = {
  initWsConnection() {
    initFirebase()
  },
  ticker: {
    getTicker,
    syncTicker,
  },
  portfolio: {
    syncPortfolioWithItems,
    addItem,
    deleteItem,
    updateItem,
  },
}