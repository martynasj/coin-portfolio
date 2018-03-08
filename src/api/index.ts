import { initFirebase } from './setup'
import ticker from './ticker'
import portfolio from './portfolios'
import auth from './auth'
import history from './history'

export class ApiService {
  public static createService() {
    const apiService = new ApiService()
    if (process.env.NODE_ENV === 'development') {
      (window as any).apiService = apiService
    }
    return apiService
  }

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

  public get history() {
    return history
  }
}