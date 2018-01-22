import { initFirebase } from './setup'
import { getTicker, syncTicker, fetchTickers } from './ticker'
import * as portfolio from './portfolios'
import auth from './auth'

export const ApiService = {
  auth,
  initWsConnection() {
    initFirebase()
  },
  ticker: {
    getTicker,
    syncTicker,
    fetchTickers,
  },
  portfolio,
}