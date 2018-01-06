import * as _ from 'lodash'
import { action, computed, observable , autorun} from 'mobx'
import { Generator } from '../util/generator'
import { TickerModel } from '../models'

export default class PortfolioItemModel {

  private store: PortfolioStore
  public id: string
  public symbol: string
  @observable private ticker: TickerModel|null
  @observable private _pricePerUnitPayed: number
  @observable private _numberOfUnits: number

  constructor(store: PortfolioStore, symbol: string, pricePerUnitPayed: number, numberOfUnits: number) {
    this.store = store
    this.id = Generator.id()
    this.symbol = symbol
    this._pricePerUnitPayed = pricePerUnitPayed
    this._numberOfUnits = numberOfUnits
    this.resolveTicker()
  }

  private resolveTicker() {
    autorun(() => {
      const ticker = this.store.tickerStore.resolveTicker(this.symbol)
      this.setTicker(ticker)
    })
  }

  @action
  private setTicker(ticker: TickerModel|null) {
    this.ticker = ticker
  }

  get numberOfUnits() {
    return this._numberOfUnits
  }

  @action
  setNumberOfUnits(newValue: number) {
    this._numberOfUnits = newValue
  }

  get pricePerUnitPayed(): number {
    return this._pricePerUnitPayed
  }

  @action
  setPricePerUnitPayed(price: number) {
    this._pricePerUnitPayed = price
  }

  @computed
  public get currentPrice(): number {
    if (this.ticker) {
      return this.ticker.priceUSD
    } else {
      return this.pricePerUnitPayed
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