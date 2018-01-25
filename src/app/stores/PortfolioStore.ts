import _ from 'lodash'
import { observable, action, computed, runInAction } from 'mobx'
import { PortfolioItemModel } from '../models'
import { ApiService } from '../api'
import CodeError from '../util/CodeError'

export class PortfolioStore {
  private unsubPortfolio
  private rootStore: RootStore
  @observable public hasLoaded: boolean = false
  @observable public id: string|null
  @observable public ownerId: string
  @observable name: string
  @observable private _items: PortfolioItemModel[] = []

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
    if (this.rootStore.user.currentUser) {
      const options = {
        ownerId: this.rootStore.user.currentUser.id,
      }
      return ApiService.portfolio.createNewPortfolio(slug, options)
    } else {
      throw new CodeError('auth/not-logged-in', 'User must be logged in to create new portfolio')
    }
  }

  @action
  public addItem(symbolId: string, pricePerUnit: number, numberOfUnits: number, exchangeId: string|null) {
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
  public async syncPortfolio(slug: string) {
    if (this.unsubPortfolio) {
      throw new Error(`Portfolio is already syncing. Call unsync before syncing new`)
    }
    this.unsubPortfolio = ApiService.portfolio.syncPortfolioWithItems(slug, portfolio => {
      runInAction(() => {
        this.hasLoaded = true
        if (portfolio) {
          this.id = portfolio.id
          this.ownerId = portfolio.ownerId
          this.name = portfolio.name
          this._items = portfolio.items.map(item => PortfolioItemModel.createFromApi(this, item))
        } else {
          this.id = null
        }
      })
    })
  }

  @action
  public unsyncPortfolio() {
    if (!this.unsubPortfolio) {
      throw new Error('No portfolio is being synced. Call sync before unsyncing')
    } else {
      this.unsubPortfolio()
      this.unsubPortfolio = null
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