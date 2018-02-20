import * as Stores from './index'
import { ApiService } from '../api'

export class RootStore {
  public portfolio: Stores.PortfolioStore
  public router: Stores.RouterStore
  public tickers: Stores.TickerStore
  public settings: Stores.SettingsStore
  public user: Stores.UserStore
  public ui: Stores.UIStore
  public modal: Stores.ModalStore

  constructor(history, apiService: ApiService) {
    this.router = new Stores.RouterStore(history)
    this.modal = new Stores.ModalStore(this)
    this.tickers = new Stores.TickerStore(this, apiService)
    this.tickers.initTickers() // only temporary here
    this.settings = new Stores.SettingsStore(this)
    this.user = new Stores.UserStore(this, apiService)
    this.portfolio = new Stores.PortfolioStore(this, apiService)
    this.ui = new Stores.UIStore(this)
  }
}
