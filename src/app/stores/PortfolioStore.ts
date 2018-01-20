import _ from 'lodash'
import { observable, action, computed, runInAction } from 'mobx'
import { PortfolioItemModel } from '../models'
import { ApiService } from '../api'
import hash from '../util/hash'

export class PortfolioStore {

  private rootStore: RootStore
  @observable public hasLoaded: boolean = false
  @observable public id: string|null
  @observable name: string
  @observable private _items: PortfolioItemModel[] = []
  @observable private lock?: string
  @observable private _isUnlocked: boolean

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }

  public get tickerStore() {
    return this.rootStore.tickers
  }

  public deleteItem(item: PortfolioItemModel) {
    if (this.id) {
      ApiService.portfolio.deleteItem(this.id, item.id)
    }
  }

  public async createNewPortfolio(slug: string): Promise<string> {
    return ApiService.portfolio.createNewPortfolio(slug)
  }

  @action
  addItem(symbolId: string, pricePerUnit: number, numberOfUnits: number, exchangeId: string|null) {
    if (this.id) {
      const apiItem = {
        symbolId,
        pricePerUnitPaidUSD: pricePerUnit,
        numberOfUnits,
        exchangeId,
      }
      ApiService.portfolio.addItem(this.id, apiItem)
    }
  }

  @action
  addItemFromApi(apiItem: Api.PortfolioItem): PortfolioItemModel {
    const portfolioItem = PortfolioItemModel.createFromApi(this, apiItem)
    this.items.push(portfolioItem)
    return portfolioItem
  }

  @action
  public async syncPortfolio(slug: string) {
    ApiService.portfolio.syncPortfolioWithItems(slug, portfolio => {
      runInAction(() => {
        this.hasLoaded = true
        if (portfolio) {
          this.id = portfolio.id
          this.name = portfolio.name
          this._items = portfolio.items.map(item => PortfolioItemModel.createFromApi(this, item))
          this.lock = portfolio.lock
          this._isUnlocked = this.isUnlocked
        } else {
            // todo: should reset everything to initial values
            this.id = null
        }
      })
    })
  }

  @action
  public async addLock(passcode: string) {
    if (this.id && !this.lock) {
      this.lockPortfolio()
      ApiService.portfolio.addLock(this.id, passcode)
    }
  }

  @action
  public lockPortfolio() {
    this._isUnlocked = false
  }

  @action
  public async unlockPortfolio(passcode: string) {
    if (this.id && this.lock) {
      if (hash(passcode) === this.lock) {
        this._isUnlocked = true
      }
    }
  }

  get items(): PortfolioItemModel[] {
    const orderType = this.rootStore.settings.orderBy
    return _.orderBy(this._items, (item: PortfolioItemModel) => {
      switch (orderType) {
        case 'alphabet':
          return item.getTickerFullName()
        case 'highest-holdings':
          return item.currentTotalValue
        case 'highest-price':
          return item.currentPriceUSD
        case 'biggest-gainer':
          return item.changePercentage // or changePercentage?
        case 'date':
          return item.createdAt
        default:
          return item.id
      }
    }, orderType === 'alphabet' ? 'asc' : 'desc')
  }

  @computed get hasLock(): boolean {
    return !!this.lock
  }

  @computed get isUnlocked(): boolean {
    if (this.hasLock) {
      return this._isUnlocked
    }
    return true
  }

  @computed get portfolioNotFound(): boolean {
    return this.hasLoaded && this.id === null
  }

  @computed get totalInitialWorth(): number {
    return this.items.reduce((sum, item) => sum + item.totalBuyValue, 0)
  }

  @computed get totalWorth(): number|null {
    return this.items.reduce((sum, item) => sum + (item.currentTotalValue || 0), 0)
  }

  @computed get change(): number {
    return this.items.reduce((sum, item) => sum + (item.change || 0), 0)
  }

  @computed get changePercentage(): number {
    if (!this.totalInitialWorth) {
      return 0
    }
    return this.change / this.totalInitialWorth * 100
  }

  public getItem(id: string): PortfolioItemModel|undefined {
    return this.items.find(i => i.id === id)
  }

}