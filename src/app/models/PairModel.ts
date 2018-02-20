interface IPairNew {
  symbolId: string
  baseSymbolId: string
  price?: number
}

export default class Pair {
  public symbolId: string
  public baseSymbolId: string
  public price?: number // todo: price should not belong in here?

  constructor(pair: IPairNew) {
    this.symbolId = pair.symbolId
    this.baseSymbolId = pair.baseSymbolId
    this.price = pair.price
  }

  get id(): string {
    return this.symbolId + '-' + this.baseSymbolId
  }

  getPairString(): string {
    return this.symbolId.toUpperCase() + '/' + this.baseSymbolId.toUpperCase()
  }
}
