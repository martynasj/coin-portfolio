import * as Stores from './index'
import { PortfolioItemModel } from '../models'

export class RootStore {
  public portfolio: Stores.PortfolioStore
  public router: Stores.RouterStore
  public ticker: Stores.TickerStore

  constructor(history) {
    this.portfolio = new Stores.PortfolioStore(this)
    this.ticker = new Stores.TickerStore(this)
    this.router = new Stores.RouterStore(history)

    this.portfolio.addItem('btc', 14000, 0.15)
    this.portfolio.addItem('eth', 750, 3.99)
    this.portfolio.addItem('xrp', 500, 0.35)
  }
}