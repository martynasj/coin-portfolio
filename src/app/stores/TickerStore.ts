import { runInAction, action, computed, observable } from 'mobx'
import { TickerModel } from '../models'
import { ApiService } from '../api'

type Tickers = { [id: string]: TickerModel }

export class TickerStore {

  private rootStore: RootStore
  public tickers: Tickers

  constructor(rootStore: RootStore, tickers?: Tickers) {
    this.rootStore = rootStore
    this.tickers = tickers || {}
  }

  @action
  public async fetchTicker(symbol: string) {
    // const ticker = await ApiService.ticker.getTicker(symbol)
    // runInAction(() => {
    //   this.tickers.btc = TickerModel.createFromApi(ticker)
    // })
  }

  public resolveTicker(symbol: string): TickerModel|null {
    return this.tickers[symbol] || null
  }

}