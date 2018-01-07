import * as Stores from './index'
import { PortfolioItemModel } from '../models'

export class RootStore {
  public portfolio: Stores.PortfolioStore
  public router: Stores.RouterStore
  public tickers: Stores.TickerStore

  constructor(history) {
    this.portfolio = new Stores.PortfolioStore(this)
    this.tickers = new Stores.TickerStore(this)
    this.router = new Stores.RouterStore(history)
  }
}