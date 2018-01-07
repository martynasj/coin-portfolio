import { initFirebase } from './setup'
import { getTicker, syncTicker } from './ticker'
import { syncPortfolioWithItems } from './portfolios'

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
  },
}