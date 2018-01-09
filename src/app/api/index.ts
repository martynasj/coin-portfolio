import { initFirebase } from './setup'
import { getTicker, syncTicker } from './ticker'
import * as Portfolio from './portfolios'

export const ApiService = {
  initWsConnection() {
    initFirebase()
  },
  ticker: {
    getTicker,
    syncTicker,
  },
  portfolio: Portfolio,
}