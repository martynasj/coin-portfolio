import * as _ from 'lodash'
import { action, computed, observable , autorun} from 'mobx'
import { Generator } from '../util/generator'
import { TickerModel } from '../models'
import { PortfolioItem } from '../components/PortfolioItem/PortfolioItem';

export default class PortfolioItemModel {

  private store: PortfolioStore
  public id: string
  public symbol: string
  @observable private ticker: TickerModel|null
  @observable private _pricePerUnitPaid: number
  @observable private _numberOfUnits: number

  constructor(store: PortfolioStore, id: string = Generator.id(), symbol: string, pricePerUnitPaid: number, numberOfUnits: number) {
    this.store = store
    this.id = id
    this.symbol = symbol
    this._pricePerUnitPaid = pricePerUnitPaid
    this._numberOfUnits = numberOfUnits
    this.syncTicker()
    this.resolveTicker()
  }

  private syncTicker() {
    this.store.tickerStore.syncTicker(this.symbol)
  }

  public resolveTicker() {
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

  get pricePerUnitPaid(): number {
    return this._pricePerUnitPaid
  }

  @action
  setPricePerUnitPayed(price: number) {
    this._pricePerUnitPaid = price
  }

  @computed
  public get currentPrice(): number {
    if (this.ticker) {
      return this.ticker.priceUSD
    } else {
      return this.pricePerUnitPaid
    }
  }

  public get totalValue(): number {
    return this.currentPrice * this.numberOfUnits
  }

  public get totalBuyValue(): number {
    return this.pricePerUnitPaid * this.numberOfUnits
  }

  public get change(): number {
    return this.totalValue - this.totalBuyValue
  }

  public get changePercentage(): number {
    return this.change / this.totalBuyValue * 100
  }

}