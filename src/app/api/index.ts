import { initFirebase } from './setup'
import { getTicker, syncTicker, fetchTickers } from './ticker'
import * as Portfolio from './portfolios'

export const ApiService = {
  initWsConnection() {
    initFirebase()
  },
  ticker: {
    getTicker,
    syncTicker,
    fetchTickers,
  },
  portfolio: Portfolio,
}