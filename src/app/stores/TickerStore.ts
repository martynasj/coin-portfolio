import { runInAction, action, observable } from 'mobx'
import { TickerModel } from '../models'
import { ApiService } from '../api'
import _ from 'lodash'

const supportedExchangeIds = [
  'bitfinex',
  'bittrex',
  'kraken',
  'poloniex',
  'binance',
  'gdax',
  'coinexchange',
]

export class TickerStore {

  // @ts-ignore
  private rootStore: RootStore
  @observable public tickers: TickerModel[]

  constructor(rootStore: RootStore, tickers?: TickerModel[]) {
    this.rootStore = rootStore
    this.tickers = tickers || []
    this.initTickers()
  }

  // public

  public syncTicker(symbol: string) {
    ApiService.ticker.syncTicker(symbol, (ticker: Api.Ticker) => {
      runInAction(() => {
        if (ticker) {
          const newTicker = TickerModel.createFromApi(this, ticker)
          this.updateTickers(newTicker)
        } else {
          // todo: handle this
        }
      })
    })
  }

  public getSupportedExchangeIds(symbolId: string): string[] {
    const ticker = this.tickers.find(t => t.id === symbolId)
    if (!ticker) {
      return []
    } else {
      const exchangeIds: string[] = _.chain(ticker)
        .pickBy((v, k) => _.includes(supportedExchangeIds, k) && !_.isUndefined(v))
        .map((_v, k) => k)
        .value()
      return exchangeIds
    }
  }

  public getTicker(symbol: string): TickerModel|null {
    return this.tickers.find(t => t.id === symbol) || null
  }

  public getBTCPriceInUSD(exchangeId: string|null, fallbackToDefault?: boolean): number|null {
    const btcTicker = this.tickers.find(t => t.id === 'btc')
    if (btcTicker) {
      return btcTicker.getPriceUSD(exchangeId, fallbackToDefault)
    } else {
      return null
    }
  }

  // private

  private initTickers = () => {
    this.fetchAllTickers()
    this.syncTicker('btc')
    this.syncTicker('eth')
  }

  private fetchAllTickers() {
    return ApiService.ticker.fetchTickers().then((apiTickers: Api.Ticker[]) => {
      const newTickers = apiTickers.map(ticker => TickerModel.createFromApi(this, ticker))
      runInAction(() => {
        this.tickers = newTickers
      })
      return newTickers
    })
  }

  @action
  private updateTickers(ticker: TickerModel) {
    const existingTickerIndex = _.findIndex(this.tickers, t => t.id === ticker.id)
    if (existingTickerIndex !== -1) {
      this.tickers[existingTickerIndex] = ticker
    } else {
      this.tickers.push(ticker)
    }
  }

}