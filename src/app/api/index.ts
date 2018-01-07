import { initFirebase } from './setup'
import { getTicker, syncTicker } from './ticker'
import { syncPortfolio } from './portfolios'

export const ApiService = {
  initWsConnection() {
    initFirebase()
  },
  ticker: {
    getTicker,
    syncTicker,
  },
  portfolio: {
    syncPortfolio,
  },
}