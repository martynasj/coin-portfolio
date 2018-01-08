import { observable, action } from 'mobx'

export default class TickerModel {
  symbol: string
  name: string
  @observable private _priceUSD?: number
  @observable private _priceBTC?: number
  bitfinex?: Api.ExchangeTicker
  bittrex?: Api.ExchangeTicker
  kraken?: Api.ExchangeTicker

  private constructor(ticker: Api.Ticker) {
    this.symbol = ticker.symbol
    this.name = ticker.name
    this._priceUSD = ticker.priceUSD
    this._priceBTC = ticker.priceBTC
    this.bitfinex = ticker.bitfinex
    this.bittrex = ticker.bittrex
    this.kraken = ticker.kraken
  }

  // Cia padariau su tickerOpts, nes galvoju ka labai daug parametru reik padouti ir islaikyt eiles tvarka kitu atveju
  public static create(tickerOpts) {
    return new TickerModel(tickerOpts)
  }

  public static createFromApi(ticker: Api.Ticker) {
    return new TickerModel({
      symbol: ticker.symbol.toLowerCase(),
      ...ticker
    })
  }

  get priceUSD() {
    return this._priceUSD
  }

  @action
  setPriceUSD(price: number) {
    this._priceUSD = price
  }
}