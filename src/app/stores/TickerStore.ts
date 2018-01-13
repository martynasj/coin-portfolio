import { runInAction, action, observable } from 'mobx'
import { TickerModel } from '../models'
import { ApiService } from '../api'
import _ from 'lodash'

const supportedExchanges = ['bitfinex', 'bittrex', 'kraken'] // todo: update with new exchanges

type SupportedExchangesById = any

export class TickerStore {

  // @ts-ignore
  private rootStore: RootStore
  @observable public tickers: TickerModel[]
  @observable public supportedExchangesById : SupportedExchangesById

  constructor(rootStore: RootStore, tickers?: TickerModel[]) {
    this.rootStore = rootStore
    this.tickers = tickers || []
    this.supportedExchangesById = {} || null
  }

  // Ziaure daug params, nzn ar ok tep :/
  @action
  public addTicker({
    id,
    name,
    priceUSD,
    priceBTC,
    bitfinex,
    bittrex,
    kraken,
  }): TickerModel {
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

  @action
  public getAllTIckers() {
    return ApiService.ticker.fetchTickers((apiTickers: Api.Ticker[]) => {
      const newTickers = apiTickers.map(ticker => TickerModel.createFromApi(ticker))
      this.tickers.concat(newTickers)
      this.resolveSupportedExchangesById(newTickers)
      return newTickers
    })
  }

  @action
  public resolveSupportedExchangesById(tickers) {
    const byId = _.reduce(tickers, (reduction, ticker) => {
      const tickerExchanges = supportedExchanges.filter(name => !!ticker[name])
      if (tickerExchanges.length > 0) {
        return {
          ...reduction,
          [ticker.id]: tickerExchanges
        }
      }
      return reduction
    }, {})

    if (!!byId) {
      this.supportedExchangesById = byId
    }
  }

  public resolveTicker(symbol: string): TickerModel|null {
    return this.tickers.find(t => t.id === symbol) || null
  }

}