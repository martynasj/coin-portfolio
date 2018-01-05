import { observable, action } from 'mobx'
import { PortfolioItemModel } from '../models'

export class PortfolioStore {

  @observable items: PortfolioItemModel[]

  constructor(portfolioItems: PortfolioItemModel[]) {
    this.items = portfolioItems
  }

  @action addItem = (portfolioItem: PortfolioItemModel) => {
    this.items.push(portfolioItem)
  }

}