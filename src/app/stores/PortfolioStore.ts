import _ from 'lodash'
import { observable, action, computed, runInAction } from 'mobx'
import { TransactionModel, TransactionGroupModel } from '../models'
import { ApiService } from '../api'
import CodeError from '../util/CodeError'
import mockTransactions from '../../../mock/transactions'

export class PortfolioStore {
  private unsubPortfolio
  private rootStore: RootStore
  public transactions: TransactionModel[]
  @observable public hasLoaded: boolean = false
  @observable public id: string|null
  @observable public ownerId: string
  @observable name: string

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    this.transactions = mockTransactions.map(t => TransactionModel.createFromApi(this.rootStore, t))
  }

  // todo: unused?
  public get tickerStore() {
    return this.rootStore.tickers
  }

  public deleteItem(item: TransactionModel) {
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
  public addTransaction(symbolId: string, pricePerUnit: number, numberOfUnits: number, exchangeId: string|null) {
    // todo: reinplement

    // if (this.id) {
    //   const apiItem = {
    //     symbolId,
    //     pricePerUnitPaidUSD: pricePerUnit,
    //     numberOfUnits,
    //     exchangeId,
    //   }
    //   ApiService.portfolio.addItem(this.id, apiItem)
    // }
  }

  @action
  public async syncPortfolio(slug: string) {
    if (this.unsubPortfolio) {
      throw new Error(`Portfolio is already syncing. Call unsync before syncing new`)
    }
    // todo: reinplement

    // this.unsubPortfolio = ApiService.portfolio.syncPortfolioWithItems(slug, portfolio => {
    //   runInAction(() => {
    //     this.hasLoaded = true
    //     if (portfolio) {
    //       this.id = portfolio.id
    //       this.ownerId = portfolio.ownerId
    //       this.name = portfolio.name
    //       this._items = portfolio.items.map(item => TransactionModel.createFromApi(this, item))
    //     } else {
    //       this.id = null
    //     }
    //   })
    // })
  }

  @action
  public unsyncPortfolio() {
    if (this.unsubPortfolio) {
      this.unsubPortfolio()
      this.unsubPortfolio = null
    }
  }

  public getTransactionGroups(): TransactionGroupModel[] {
    return _.chain(this.transactions)
      .groupBy(t => t.symbolId)
      .map(transactions => new TransactionGroupModel(this.rootStore, transactions))
      .value()

    // const orderType = this.rootStore.settings.orderBy
    // return _.orderBy(this._items, (item: TransactionModel) => {
    //   switch (orderType) {
    //     case 'alphabet':
    //       return item.getTickerFullName()
    //     case 'highest-holdings':
    //       return item.currentTotalValue
    //     case 'highest-price':
    //       return item.currentPriceUSD
    //     case 'biggest-gainer':
    //       return item.changePercentage // or changePercentage?
    //     case 'date':
    //       return item.createdAt
    //     default:
    //       return item.id
    //   }
    // }, orderType === 'alphabet' ? 'asc' : 'desc')
  }

  public getTransactionGroup(groupId: string): TransactionGroupModel|undefined {
    const groups = this.getTransactionGroups()
    return _.find(groups, group => group.id === groupId)
  }

  @computed get portfolioNotFound(): boolean {
    return this.hasLoaded && this.id === null
  }

  @computed get totalInitialWorth(): number {
    // reinplement
    return 0
    // return this.items.reduce((sum, item) => sum + item.totalBuyValue, 0)
  }

  @computed get totalWorth(): number|null {
    // reinplement
    return 0
    // return this.items.reduce((sum, item) => sum + (item.currentTotalValue || 0), 0)
  }

  @computed get change(): number {
    // reinplement 
    return 0
    // return this.items.reduce((sum, item) => sum + (item.change || 0), 0)
  }

  @computed get changePercentage(): number {
    // reinplement
    return 0
    // if (!this.totalInitialWorth) {
    //   return 0
    // }
    // return this.change / this.totalInitialWorth * 100
  }

  public getTransaction(id: string): TransactionModel|undefined {
    return this.transactions.find(i => i.id === id)
  }

}