import { runInAction, action, computed, observable } from 'mobx'
import { TickerModel } from '../models'
import { ApiService } from '../api'
import _ from 'lodash'

export class TickerStore {

  private rootStore: RootStore
  @observable public tickers: TickerModel[]

  constructor(rootStore: RootStore, tickers?: TickerModel[]) {
    this.rootStore = rootStore
    this.tickers = tickers || []
  }

  // Ziaure daug params, nzn ar ok tep :/
  @action
  public addTicker(
    symbol: string,
    name: string,
    priceUSD: number,
    priceBTC: number,
    bitfinex: Api.ExchangeTicker,
    bittrex: Api.ExchangeTicker,
    kraken: Api.ExchangeTicker,
  ): TickerModel {
    const ticker = TickerModel.create({ symbol, name, priceUSD, priceBTC, bitfinex, bittrex, kraken })
    this.tickers.push(ticker)
    return ticker
  }

  @action updateTickers(ticker: TickerModel) {
    const existingTickerIndex = _.findIndex(this.tickers, t => t.symbol === ticker.symbol)
    if (existingTickerIndex !== -1) {
      this.tickers[existingTickerIndex] = ticker
    } else {
      this.tickers.push(ticker)
    }      
  }

  @action
  public async fetchTicker(symbol: string) {
    // const ticker = await ApiService.ticker.getTicker(symbol)
    // runInAction(() => {
    //   this.tickers.btc = TickerModel.createFromApi(ticker)
    // })
  }

  public syncTicker(symbol: string) {
    const unsub = ApiService.ticker.syncTicker(symbol, (ticker: Api.Ticker) => {
      runInAction(() => {
        if (ticker) {
          const newTicker = TickerModel.createFromApi(ticker)
          this.updateTickers(newTicker)
          console.log(this.tickers)
        } else {
          // todo: handle this
        }
      })
    })
  }

  public resolveTicker(symbol: string): TickerModel|null {
    return this.tickers.find(t => t.symbol === symbol) || null
  }

}