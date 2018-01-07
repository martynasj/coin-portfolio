import { observable, action, computed, runInAction } from 'mobx'
import { PortfolioItemModel } from '../models'
import { ApiService } from '../api'

export class PortfolioStore {

  private rootStore: RootStore
  @observable public hasLoaded: boolean = false
  @observable private id: string|null
  @observable name: string
  @observable items: PortfolioItemModel[] = []

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }

  public get tickerStore() {
    return this.rootStore.tickers
  }

  @action
  addItem(symbolId: string, pricePerUnit: number, numberOfUnits: number) {
    if (this.id) {
      const apiItem = {
        symbolId,
        pricePerUnitPaidUSD: pricePerUnit,
        numberOfUnits,
      }
      ApiService.portfolio.addItem(this.id, apiItem)
    }
  }

  @action
  deleteItem(item: PortfolioItemModel) {
    if (this.id) {
      ApiService.portfolio.deleteItem(this.id, item.id)
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
    const unsub = ApiService.portfolio.syncPortfolioWithItems(slug, portfolio => {
      runInAction(() => {
        this.hasLoaded = true
        if (portfolio) {
            this.id = portfolio.id
            this.name = portfolio.name
            this.items = portfolio.items.map(item => PortfolioItemModel.createFromApi(this, item))
          } else {
            this.id = null
          }
        })
    })
  }

  @computed get portfolioNotFound(): boolean {
    return this.hasLoaded && this.id === null
  }

  @computed get totalInitialWorth(): number {
    return this.items.reduce((sum, item) => sum + item.totalBuyValue, 0)
  }

  @computed get totalWorth(): number {
    return this.items.reduce((sum, item) => sum + item.totalValue, 0)
  }

  @computed get change(): number {
    return this.items.reduce((sum, item) => sum + item.change, 0)
  }

  @computed get changePercentage(): number {
    if (!this.totalInitialWorth) {
      return 0
    }
    return this.change / this.totalInitialWorth * 100
  }

}