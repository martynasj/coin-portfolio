import * as Stores from './index'

export class RootStore {
  public portfolio: Stores.PortfolioStore
  public router: Stores.RouterStore
  public tickers: Stores.TickerStore
  public settings: Stores.SettingsStore
  public user: Stores.UserStore

  constructor(history) {
    this.router = new Stores.RouterStore(history)
    this.tickers = new Stores.TickerStore(this)
    this.settings = new Stores.SettingsStore(this)
    this.user = new Stores.UserStore(this)
    this.portfolio = new Stores.PortfolioStore(this)
  }
}