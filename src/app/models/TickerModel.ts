import { observable, action } from 'mobx'

export default class TickerModel {
  id: string
  name: string
  @observable private _priceUSD?: number
  @observable private _priceBTC?: number
  bitfinex?: Api.ExchangeTicker
  bittrex?: Api.ExchangeTicker
  kraken?: Api.ExchangeTicker
  binance?: Api.ExchangeTicker
  gdax?: Api.ExchangeTicker
  poloniex?: Api.ExchangeTicker
  coinexchange?: Api.ExchangeTicker

  private constructor(ticker: Api.Ticker) {
    this.id = ticker.id
    this.name = ticker.name
    this._priceUSD = ticker.priceUSD
    this._priceBTC = ticker.priceBTC
    this.bitfinex = ticker.bitfinex
    this.bittrex = ticker.bittrex
    this.kraken = ticker.kraken
    this.binance = ticker.binance
    this.gdax = ticker.gdax
    this.coinexchange = ticker.coinexchange
    this.poloniex = ticker.poloniex
  }

  // Cia padariau su tickerOpts, nes galvoju ka labai daug parametru reik padouti ir islaikyt eiles tvarka kitu atveju
  public static create(tickerOpts) {
    return new TickerModel(tickerOpts)
  }

  public static createFromApi(ticker: Api.Ticker) {
    return new TickerModel(ticker)
  }

  get priceUSD() {
    return this._priceUSD
  }

  get priceBTC() {
    return this._priceBTC
  }

  get symbol() {
    return this.id.toUpperCase()
  }

  @action
  setPriceUSD(price: number) {
    this._priceUSD = price
  }
}