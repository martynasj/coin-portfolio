import { initFirebase } from './setup'
import ticker from './ticker'
import portfolio from './portfolios'
import auth from './auth'

export class ApiService {
  public initWsConnection() {
    initFirebase()
  }

  public get auth() {
    return auth
  }

  public get ticker() {
    return ticker
  }

  public get portfolio() {
    return portfolio
  }
}
