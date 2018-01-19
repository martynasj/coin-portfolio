import { action, computed, observable , autorun } from 'mobx'
import { Generator } from '../util/generator'
import { TickerModel } from '../models'
import { ApiService } from '../api'

export default class PortfolioItemModel {

  private store: PortfolioStore
  public id: string
  public symbolId: string
  public createdAt: Date
  @observable private _exchangeId: string|null
  @observable private ticker: TickerModel|null
  @observable private _pricePerUnitPaid: number
  @observable private _numberOfUnits: number

  constructor(store: PortfolioStore, id: string = Generator.id(), symbol: string, pricePerUnitPaid: number, numberOfUnits: number, exchangeId: string|null, createdAt: Date) {
    this.store = store
    this.id = id
    this.symbolId = symbol
    this.createdAt = createdAt
    this._exchangeId = exchangeId
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
      apiItem.exchangeId,
      apiItem.createdAt,
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

  public get exchangeId(): string|null {
    return this._exchangeId
  }

  public set exchangeId(exchangeId: string|null) {
    if (this.store.id) {
      ApiService.portfolio.updateItem(this.store.id, this.id, {
        exchangeId,
      })
    }
  }

  @action
  setPricePerUnitPayed(price: number) {
    this._pricePerUnitPaid = price
  }

  @computed
  public get currentPriceUSD(): number|null {
    if (this.ticker) {
      return this.ticker.getCalculatedPriceInUSD(this.exchangeId)
    } else {
      return null
    }
  }

  public get totalValue(): number|null {
    if (this.currentPriceUSD) {
      return this.currentPriceUSD * this.numberOfUnits
    } else {
      return null
    }
  }

  public get totalBuyValue(): number {
    return this.pricePerUnitPaid * this.numberOfUnits
  }

  public get change(): number|null {
    if (this.totalValue) {
      return this.totalValue - this.totalBuyValue
    }
    return null
  }

  public get changePercentage(): number|null {
    if (this.change) {
      return this.change / this.totalBuyValue * 100
    } else {
      return null
    }
  }

  public getTickerFullName(): string {
    if (this.ticker) {
      return this.ticker.name
    } else {
      return ''
    }
  }

}