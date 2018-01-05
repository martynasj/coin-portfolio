import * as _ from 'lodash'
import { Generator } from '../util/generator'

export default class PortfolioItemModel {

  public id: string
  public symbol: string
  public pricePerUnitPayed: number
  public numberOfUnits: number

  constructor(symbol: string, pricePerUnitPayed: number, numberOfUnits: number) {
    this.id = Generator.id()
    this.symbol = symbol
    this.pricePerUnitPayed = pricePerUnitPayed
    this.numberOfUnits = numberOfUnits
  }

  public get currentPrice(): number {
    return _.round(_.random(0.001, 20000), 3)
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