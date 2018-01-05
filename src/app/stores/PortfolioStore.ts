import { observable, action, computed } from 'mobx'
import { PortfolioItemModel } from '../models'

export class PortfolioStore {

  @observable items: PortfolioItemModel[]

  constructor(portfolioItems: PortfolioItemModel[]) {
    this.items = portfolioItems
  }

  @action addItem = (portfolioItem: PortfolioItemModel) => {
    this.items.push(portfolioItem)
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