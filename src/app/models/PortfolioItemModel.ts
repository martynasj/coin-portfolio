import { action, computed, observable , autorun} from 'mobx'
import { Generator } from '../util/generator'
import { TickerModel } from '../models'
import { ApiService } from '../api'

export default class PortfolioItemModel {

  private store: PortfolioStore
  public id: string
  public symbolId: string
  public exchange: string
  @observable private ticker: TickerModel|null
  @observable private _pricePerUnitPaid: number
  @observable private _numberOfUnits: number

  constructor(store: PortfolioStore, id: string = Generator.id(), symbol: string, pricePerUnitPaid: number, numberOfUnits: number, exchange: string) {
    this.store = store
    this.id = id
    this.symbolId = symbol
    this.exchange = exchange
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
      apiItem.numberOfUnits,
      apiItem.exchange,
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

  public get numberOfUnits() {
    return this._numberOfUnits
  }

  public set numberOfUnits(newValue: number) {
    if (this.store.id) {
      ApiService.portfolio.updateItem(this.store.id, this.id, {
        numberOfUnits: newValue,
      })
    }
  }

  @action
  setNumberOfUnits(newValue: number) {
    this._numberOfUnits = newValue
  }

  public get pricePerUnitPaid(): number {
    return this._pricePerUnitPaid
  }

  public set pricePerUnitPaid(newValue: number) {
    if (this.store.id) {
      ApiService.portfolio.updateItem(this.store.id, this.id, {
        pricePerUnitPaidUSD: newValue,
      })
    }
  }

  @action
  setPricePerUnitPayed(price: number) {
    this._pricePerUnitPaid = price
  }

  @computed
  public get currentPrice(): number {
    if (this.ticker && this.ticker.priceUSD) {
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