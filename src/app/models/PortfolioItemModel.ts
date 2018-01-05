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

}