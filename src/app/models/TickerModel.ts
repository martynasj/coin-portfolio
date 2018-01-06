import { observable, action } from 'mobx'

let id = 0

export default class TickerModel {
  id: string
  symbol: string
  name: string
  @observable private _priceUSD: number

  private constructor(ticker: Api.Ticker) {
    this.id = ticker.id
    this.name = ticker.name
    this.symbol = ticker.symbol
    this._priceUSD = ticker.priceUSD
  }

  public static create(symbol: string, name: string, priceUSD: number) {
    return new TickerModel({
      id: id++ + '',
      symbol,
      name,
      priceUSD,
    })
  }

  public static createFromApi(ticker: Api.Ticker) {
    return new TickerModel(ticker)
  }

  get priceUSD() {
    return this._priceUSD
  }

  @action
  setPriceUSD(price: number) {
    this._priceUSD = price
  }
}