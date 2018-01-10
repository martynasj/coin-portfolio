import { runInAction, action, observable } from 'mobx'
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
    id: string,
    name: string,
    priceUSD: number,
    priceBTC: number,
    bitfinex: Api.ExchangeTicker,
    bittrex: Api.ExchangeTicker,
    kraken: Api.ExchangeTicker,
  ): TickerModel {
    const ticker = TickerModel.create({ id, name, priceUSD, priceBTC, bitfinex, bittrex, kraken })
    this.tickers.push(ticker)
    return ticker
  }

  @action updateTickers(ticker: TickerModel) {
    const existingTickerIndex = _.findIndex(this.tickers, t => t.id === ticker.id)
    if (existingTickerIndex !== -1) {
      this.tickers[existingTickerIndex] = ticker
    } else {
      this.tickers.push(ticker)
    }
  }

  public syncTicker(symbol: string) {
    ApiService.ticker.syncTicker(symbol, (ticker: Api.Ticker) => {
      runInAction(() => {
        if (ticker) {
          const newTicker = TickerModel.createFromApi(ticker)
          this.updateTickers(newTicker)
        } else {
          // todo: handle this
        }
      })
    })
  }

  public resolveTicker(symbol: string): TickerModel|null {
    return this.tickers.find(t => t.id === symbol) || null
  }

}