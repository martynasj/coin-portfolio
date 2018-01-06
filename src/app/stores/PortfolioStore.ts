import { observable, action, computed } from 'mobx'
import { PortfolioItemModel } from '../models'

export class PortfolioStore {

  private rootStore: RootStore
  @observable items: PortfolioItemModel[] = []

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }

  public get tickerStore() {
    return this.rootStore.ticker
  }

  @action addItem = (symbol: string, pricePerUnit: number, numberOfUnits: number): PortfolioItemModel => {
    const portfolioItem = new PortfolioItemModel(this, symbol, pricePerUnit, numberOfUnits)
    this.items.push(portfolioItem)
    return portfolioItem
  }

  @computed get totalInitialWorth() {
    return this.items.reduce((sum, item) => sum + item.totalBuyValue, 0)
  }

  @computed get totalWorth() {
    return this.items.reduce((sum, item) => sum + item.totalValue, 0)
  }

  @computed get change() {
    return this.items.reduce((sum, item) => sum + item.change, 0)
  }

  @computed get changePercentage() {
    return this.change / this.totalInitialWorth * 100
  }

}