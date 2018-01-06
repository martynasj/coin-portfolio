export default class TickerModel {
  id: string
  symbol: string
  name: string
  priceUSD: number

  private constructor(ticker: Api.Ticker) {
    this.id = ticker.id
    this.name = ticker.name
    this.symbol = ticker.symbol
    this.priceUSD = ticker.priceUSD
  }

  public static createFromApi(ticker: Api.Ticker) {
    return new TickerModel(ticker)
  }
}