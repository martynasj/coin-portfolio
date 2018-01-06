import * as _ from 'lodash'
import { computed } from 'mobx'
import { Generator } from '../util/generator'

export default class PortfolioItemModel {

  private store: PortfolioStore
  public id: string
  public symbol: string
  public pricePerUnitPayed: number
  public numberOfUnits: number

  constructor(store: PortfolioStore, symbol: string, pricePerUnitPayed: number, numberOfUnits: number) {
    this.store = store
    this.id = Generator.id()
    this.symbol = symbol
    this.pricePerUnitPayed = pricePerUnitPayed
    this.numberOfUnits = numberOfUnits
  }

  @computed
  public get currentPrice(): number {
    const resolvedTicker = this.store.tickerStore.resolveTicker(this.symbol)
    if (resolvedTicker) {
      return resolvedTicker.priceUSD
    } else {
      return _.round(_.random(0.001, 20000), 3)
    }
  }

  public get totalValue(): number {
    return this.currentPrice * this.numberOfUnits
  }

  public get totalBuyValue(): number {
    return this.pricePerUnitPayed * this.numberOfUnits
  }

  public get change(): number {
    return this.totalValue - this.totalBuyValue
  }

  public get changePercentage(): number {
    return this.change / this.totalBuyValue * 100
  }

}