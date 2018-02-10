import { action, computed, observable, autorun } from 'mobx'
import { TickerModel } from '../models'
import { ApiService } from '../api'

export default class TransactionModel {
  private store: RootStore
  public id: string
  public symbolId: string
  public createdAt: Date
  @observable private _type: 'buy' | 'sell'
  @observable private _baseSymbolId: string
  @observable private _baseSymbolPriceUsd: number
  @observable private _exchangeId: string
  @observable private _unitPrice: number
  @observable private _numberOfUnits: number
  @observable private ticker: TickerModel | null
  @observable public transactionDate: Date

  constructor(store: RootStore, apiItem: Api.Transaction) {
    this.store = store

    this.id = apiItem.id
    this._type = apiItem.type
    this.symbolId = apiItem.symbolId
    this.createdAt = apiItem.createdAt
    this._exchangeId = apiItem.exchangeId
    this._unitPrice = apiItem.unitPrice
    this._numberOfUnits = apiItem.numberOfUnits
    this._baseSymbolPriceUsd = apiItem.baseSymbolPriceUsd
    this._baseSymbolId = apiItem.baseSymbolId
    this.transactionDate = apiItem.transactionDate

    this.syncTicker()
    this.resolveTicker()
  }

  public static createFromApi(store: RootStore, apiItem: Api.Transaction) {
    return new TransactionModel(store, apiItem)
  }

  // region public

  public get type() {
    return this._type
  }

  public get numberOfUnits() {
    return this._numberOfUnits
  }

  public get exchangeId(): string {
    return this._exchangeId
  }

  public get unitPrice(): number {
    return this._unitPrice
  }

  public get baseSymbolPriceUsd(): number {
    return this._baseSymbolPriceUsd
  }

  public get baseSymbolId(): string {
    return this._baseSymbolId
  }

  /**
   * Returns current price of a unit based on PriceMode setting
   */
  public getCalculatedCurrentUnitPrice(): number | null {
    if (this.ticker) {
      if (this.isCryptoMode()) {
        return this.ticker.getPrice(this._baseSymbolId, this.exchangeId, false)
      } else {
        return this.ticker.getPrice('usd', this.exchangeId, true)
      }
    } else {
      return null
    }
  }

  /**
   * Returns price based on PriceMode setting
   */
  public getCalculatedUnitPrice(): number {
    if (this.isCryptoMode()) {
      return this._unitPrice
    } else {
      return this._unitPrice * this._baseSymbolPriceUsd
    }
  }

  /**
   * Returns calculated total value based on PriceMode setting
   */
  public getCalculatedTotalValue(): number {
    return this.getCalculatedUnitPrice() * this.numberOfUnits
  }

  public get currentTotalValue(): number | null {
    const unitPrice = this.getCalculatedCurrentUnitPrice()
    if (unitPrice) {
      return unitPrice * this.numberOfUnits
    } else {
      return null
    }
  }

  public get delta(): number | null {
    if (this.currentTotalValue) {
      return this.currentTotalValue - this.getCalculatedTotalValue()
    }
    return null
  }

  public get deltaPercentage(): number | null {
    if (this.delta) {
      return this.delta / this.getCalculatedTotalValue() * 100
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

  @computed
  public get tradingPair(): string {
    return this.symbolId.toUpperCase() + '/' + this._baseSymbolId.toUpperCase()
  }

  public get transactionDateFormatted(): string {
    return this.transactionDate.toLocaleString()
  }

  // setters

  public set unitPrice(newValue: number) {
    if (this.store.portfolio.id) {
      ApiService.portfolio.updateTransaction(this.store.portfolio.id, this.id, {
        pricePerUnitPaidUSD: newValue,
      })
    }
  }

  public set numberOfUnits(newValue: number) {
    if (this.store.portfolio.id) {
      ApiService.portfolio.updateTransaction(this.store.portfolio.id, this.id, {
        numberOfUnits: newValue,
      })
    }
  }

  public set baseSymbolPriceUsd(newValue: number) {
    if (this.store.portfolio.id) {
      ApiService.portfolio.updateTransaction(this.store.portfolio.id, this.id, {
        baseSymbolPriceUsd: newValue,
      })
    }
  }

  @action
  setNumberOfUnits(newValue: number) {
    this._numberOfUnits = newValue
  }

  public set exchangeId(exchangeId: string) {
    if (this.store.portfolio.id) {
      ApiService.portfolio.updateTransaction(this.store.portfolio.id, this.id, {
        exchangeId,
      })
    }
  }

  @action
  setPricePerUnitPayed(price: number) {
    this._unitPrice = price
  }

  public delete(): void {
    this.store.portfolio.deleteItem(this)
  }

  // endregion public

  // region private

  private resolveTicker() {
    autorun(() => {
      const ticker = this.store.tickers.getTicker(this.symbolId)
      this.setTicker(ticker)
    })
  }

  @action
  private setTicker(ticker: TickerModel | null) {
    this.ticker = ticker
  }

  private syncTicker() {
    // todo: unsync when this model is deleted
    this.store.tickers.syncTicker(this.symbolId)
  }

  private isCryptoMode(): boolean {
    return this.store.settings.priceMode === 'crypto'
  }

  // endregion private
}
