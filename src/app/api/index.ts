import { initFirebase } from './setup'
import { getTicker } from './ticker'
import { syncPortfolio } from './portfolios'

export const ApiService = {
  initWsConnection() {
    initFirebase()
  },
  ticker: {
    getTicker,
  },
  portfolio: {
    syncPortfolio,
  },
}