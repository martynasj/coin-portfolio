import _ from 'lodash'
import TransactionModel from './PortfolioItemModel'

class TransactionGroupModel {
  private store: RootStore
  public transactions: TransactionModel[]

  constructor(rootStore: RootStore, transactions: TransactionModel[]) {
    this.store = rootStore
    this.transactions = transactions
  }

  // public 

  public get id(): string {
    // figure this out later
    return this.getFirstTransaction().symbolId
  }

  public get symbolId(): string {
    return this.getFirstTransaction().symbolId
  }

  public getTickerFullName(): string {
    // implement  
    return '[Ticker full name]'  
  }

  // private

  private getFirstTransaction(): TransactionModel {
    const first = _.first(this.transactions)
    if (first) {
      return first
    } else {
      throw new Error('Transaction group must have at least 1 transaction')
    }
  }
}

export default TransactionGroupModel