import { initFirebase } from './setup'
import { getTicker } from './ticker'

export const ApiService = {
  initWsConnection() {
    initFirebase()
  },
  ticker: {
    getTicker,
  },
}