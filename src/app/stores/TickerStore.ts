import { runInAction, action, computed, observable } from 'mobx'
import { TickerModel } from '../models'
import { ApiService } from '../api'

export class TickerStore {

  private rootStore: RootStore
  @observable public tickers: { [symbol: string]: TickerModel | null }

  constructor(rootStore: RootStore, tickers?: { [symbol: string]: TickerModel }) {
    this.rootStore = rootStore
    this.tickers = tickers || {}
  }

  @action
  public addTicker(symbol: string, name: string, priceUSD: number): TickerModel {
    const ticker = TickerModel.create(symbol, name, priceUSD)
    this.tickers[symbol] = ticker
    return ticker
  }

  @action
  public syncTicker(symbol: string) {
    const unsub = ApiService.ticker.syncTicker(symbol, ticker => {
      runInAction(() => { // what this runInAction for?
        if (ticker) {
          this.addTicker(ticker.symbol.toLowerCase(), ticker.name, ticker.priceUSD)
          } else {
            this.tickers[symbol] = null
          }
        })
    })
  }

  @action
  public async fetchTicker(symbol: string) {
    // const ticker = await ApiService.ticker.getTicker(symbol)
    // runInAction(() => {
    //   this.tickers.btc = TickerModel.createFromApi(ticker)
    // })
  }

  public resolveTicker(symbol: string): TickerModel|null {
    
    // todo: NEVEIK KRC. tickers[symbol] duod undefined, cia gal del to mobx objekto?
    return this.tickers[symbol] || null
  }

}