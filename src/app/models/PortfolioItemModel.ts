import * as _ from 'lodash'
import { action, computed, observable , autorun} from 'mobx'
import { Generator } from '../util/generator'
import { TickerModel } from '../models'
import { PortfolioItem } from '../components/PortfolioItem/PortfolioItem';

export default class PortfolioItemModel {

  private store: PortfolioStore
  public id: string
  public symbolId: string
  @observable private ticker: TickerModel|null
  @observable private _pricePerUnitPaid: number
  @observable private _numberOfUnits: number

  constructor(store: PortfolioStore, id: string = Generator.id(), symbol: string, pricePerUnitPaid: number, numberOfUnits: number) {
    this.store = store
    this.id = id
    this.symbolId = symbol
    this._pricePerUnitPaid = pricePerUnitPaid
    this._numberOfUnits = numberOfUnits
    this.syncTicker()
    this.resolveTicker()
  }

  public static createFromApi(store: PortfolioStore, apiItem: Api.PortfolioItem) {
    return new PortfolioItemModel(
      store,
      apiItem.id,
      apiItem.symbolId,
      apiItem.pricePerUnitPaidUSD,
      apiItem.numberOfUnits
    )
  }

  private syncTicker() {
    // todo: unsync when this model is deleted
    this.store.tickerStore.syncTicker(this.symbolId)
  }

  public resolveTicker() {
    autorun(() => {
      const ticker = this.store.tickerStore.resolveTicker(this.symbolId)
      this.setTicker(ticker)
    })
  }

  public delete() {
    this.store.deleteItem(this)
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