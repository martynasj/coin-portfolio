interface IPairNew {
  symbolId: string
  baseSymbolId: string
  price: number
}

export default class Pair {
  public symbolId: string
  public baseSymbolId: string
  public price: number

  constructor(pair: IPairNew) {
    this.symbolId = pair.symbolId
    this.baseSymbolId = pair.baseSymbolId
    this.price = pair.price
  }

  getPairString(): string {
    return this.symbolId.toUpperCase() + '/' + this.baseSymbolId.toUpperCase()
  }
}