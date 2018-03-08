import { runInAction, action, observable, IObservableArray } from 'mobx'
import { TickerModel, PairModel } from '../models'
import { ApiService } from '../api'
import _ from 'lodash'

const supportedExchangeIds = ['bitfinex', 'bittrex', 'kraken', 'poloniex', 'binance', 'gdax', 'coinexchange']

export class TickerStore {
  // @ts-ignore
  private rootStore: RootStore
  private apiService: any
  public tickers: IObservableArray<TickerModel> = observable([])

  constructor(rootStore: RootStore, apiService: ApiService, tickers?: TickerModel[]) {
    this.rootStore = rootStore
    this.apiService = apiService
    if (tickers) {
      this.setTickers(tickers)
    }
  }

  // public

  public syncTicker(symbol: string) {
    this.apiService.ticker.syncTicker(symbol, (ticker: Api.Ticker) => {
      runInAction(() => {
        if (ticker) {
          const newTicker = TickerModel.createFromApi(this, ticker)
          this.updateTicker(newTicker)
        } else {
          // todo: handle this
        }
      })
    })
  }

  public getSupportedExchangeIds(symbolId?: string): string[] {
    if (!symbolId) {
      return supportedExchangeIds
    }
    const ticker = this.tickers.find(t => t.id === symbolId)
    if (!ticker) {
      return []
    }
    return ticker.getSupportedExchangeIds()
  }

  public getTicker(symbol: string): TickerModel | null {
    return this.tickers.find(t => t.id === symbol) || null
  }

  public getBTCPriceInUSD(exchangeId: string | null, fallbackToDefault?: boolean): number | null {
    const btcTicker = this.tickers.find(t => t.id === 'btc')
    if (btcTicker) {
      return btcTicker.getPriceUSD(exchangeId, fallbackToDefault)
    } else {
      return null
    }
  }

  public getPairs(exchangeId: string): PairModel[] {
    return _.chain(this.tickers)
      .map(ticker => ticker.getPairs(exchangeId))
      .flatten()
      .value()
  }

  // private

  public initTickers = () => {
    this.fetchAllTickers()
    this.syncTicker('btc')
    this.syncTicker('eth')
  }

  private fetchAllTickers() {
    return this.apiService.ticker.fetchTickers().then((apiTickers: Api.Ticker[]) => {
      const newTickers = apiTickers.map(ticker => TickerModel.createFromApi(this, ticker))
      this.setTickers(newTickers)
      return newTickers
    })
  }

  @action
  public setTickers(tickers: TickerModel[]) {
    this.tickers.replace(tickers)
  }

  @action
  private updateTicker(ticker: TickerModel) {
    const existingTickerIndex = _.findIndex(this.tickers, t => t.id === ticker.id)
    if (existingTickerIndex !== -1) {
      this.tickers[existingTickerIndex] = ticker
    } else {
      this.tickers.push(ticker)
    }
  }
}
