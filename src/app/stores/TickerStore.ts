import { runInAction, action, computed, observable } from 'mobx'
import { TickerModel } from '../models'
import { ApiService } from '../api'

export class TickerStore {

  private rootStore: RootStore
  @observable public tickers: TickerModel[]

  constructor(rootStore: RootStore, tickers?: TickerModel[]) {
    this.rootStore = rootStore
    this.tickers = tickers || []
  }

  @action
  public addTicker(symbol: string, name: string, priceUSD: number): TickerModel {
    const ticker = TickerModel.create(symbol, name, priceUSD)
    this.tickers.push(ticker)
    return ticker
  }

  @action
  public async fetchTicker(symbol: string) {
    // const ticker = await ApiService.ticker.getTicker(symbol)
    // runInAction(() => {
    //   this.tickers.btc = TickerModel.createFromApi(ticker)
    // })
  }

  public resolveTicker(symbol: string): TickerModel|null {
    return this.tickers.find(t => t.symbol === symbol) || null
  }

}