import { action, computed, observable , autorun } from 'mobx'
import { TickerModel } from '../models'
import { ApiService } from '../api'

export default class TransactionModel {

  private store: RootStore
  public id: string
  public symbolId: string
  public createdAt: Date
  @observable private baseSymbolId: string
  @observable private baseSymbolPriceUsd: number|null
  @observable private _exchangeId: string|null
  @observable private unitPrice: number
  @observable private _numberOfUnits: number
  @observable private ticker: TickerModel|null
  @observable private transactionDate: Date

  constructor(store: RootStore, apiItem: Api.Transaction) {
    this.store = store

    this.id = apiItem.id
    this.symbolId = apiItem.symbolId
    this.createdAt = apiItem.createdAt
    this._exchangeId = apiItem.exchangeId
    this.unitPrice = apiItem.unitPrice
    this._numberOfUnits = apiItem.numberOfUnits
    this.baseSymbolPriceUsd = apiItem.baseSumbolPriceUsd
    this.baseSymbolId = apiItem.baseSymbolId
    this.transactionDate = apiItem.transactionDate

    this.syncTicker()
    this.resolveTicker()
  }

  public static createFromApi(store: RootStore, apiItem: Api.Transaction) {
    return new TransactionModel(store, apiItem)
  }

  private syncTicker() {
    // todo: unsync when this model is deleted
    this.store.tickers.syncTicker(this.symbolId)
  }

  public resolveTicker() {
    autorun(() => {
      const ticker = this.store.tickers.getTicker(this.symbolId)
      this.setTicker(ticker)
    })
  }

  public delete(): void {
    this.store.portfolio.deleteItem(this)
  }

  @action
  private setTicker(ticker: TickerModel|null) {
    this.ticker = ticker
  }

  public get numberOfUnits() {
    return this._numberOfUnits
  }

  public set numberOfUnits(newValue: number) {
    if (this.store.portfolio.id) {
      ApiService.portfolio.updateItem(this.store.portfolio.id, this.id, {
        numberOfUnits: newValue,
      })
    }
  }

  @action
  setNumberOfUnits(newValue: number) {
    this._numberOfUnits = newValue
  }

  public get pricePerUnitPaid(): number {
    return this.unitPrice
  }

  public set pricePerUnitPaid(newValue: number) {
    if (this.store.portfolio.id) {
      ApiService.portfolio.updateItem(this.store.portfolio.id, this.id, {
        pricePerUnitPaidUSD: newValue,
      })
    }
  }

  public get exchangeId(): string|null {
    return this._exchangeId
  }

  public set exchangeId(exchangeId: string|null) {
    if (this.store.portfolio.id) {
      ApiService.portfolio.updateItem(this.store.portfolio.id, this.id, {
        exchangeId,
      })
    }
  }

  @action
  setPricePerUnitPayed(price: number) {
    this.unitPrice = price
  }

  @computed
  public get currentPriceUSD(): number|null {
    if (this.ticker) {
      return this.ticker.getCalculatedPriceInUSD(this.exchangeId)
    } else {
      return null
    }
  }

  public get currentTotalValue(): number|null {
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
    if (this.currentTotalValue) {
      return this.currentTotalValue - this.totalBuyValue
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