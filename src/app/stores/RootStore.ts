import * as Stores from './index'

export class RootStore {
  public portfolio: Stores.PortfolioStore
  public router: Stores.RouterStore
  public tickers: Stores.TickerStore
  public settings: Stores.SettingsStore
  public user: Stores.UserStore

  constructor(history) {
    this.portfolio = new Stores.PortfolioStore(this)
    this.tickers = new Stores.TickerStore(this)
    this.router = new Stores.RouterStore(history)
    this.settings = new Stores.SettingsStore(this)
    this.user = new Stores.UserStore(this)
  }
}