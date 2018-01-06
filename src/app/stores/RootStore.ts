import * as Stores from './index'
import { PortfolioItemModel } from '../models'

export class RootStore {
  public portfolio: Stores.PortfolioStore
  public router: Stores.RouterStore
  public ticker: Stores.TickerStore

  constructor(history) {
    const defaultPortfolioItems = [
      new PortfolioItemModel('btc', 14000, 0.15),
      new PortfolioItemModel('eth', 750, 3.99),
      new PortfolioItemModel('xrp', 0.35, 500),
    ]

    this.portfolio = new Stores.PortfolioStore(this, defaultPortfolioItems)
    this.ticker = new Stores.TickerStore(this)
    this.router = new Stores.RouterStore(history)
  }
}