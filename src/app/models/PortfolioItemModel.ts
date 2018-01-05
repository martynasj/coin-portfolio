export default class PortfolioItemModel {

  public symbol: string
  private pricePerUnitPayed: number

  constructor(symbol: string, pricePerUnitPayed: number) {
    this.symbol = symbol
    this.pricePerUnitPayed = pricePerUnitPayed
  }

}