import _ from 'lodash'
import TransactionModel from './TransactionModel'

class TransactionGroupModel {
  private store: RootStore
  public _transactions: TransactionModel[]

  constructor(rootStore: RootStore, transactions: TransactionModel[]) {
    this.store = rootStore
    this._transactions = transactions
  }

  // region public 

  // getters

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

  public get transactions(): TransactionModel[] {
    return _.orderBy(this._transactions, t => t.transactionDate.getTime(), ['desc'])
  }

  // actions

  // endregion public

  // region private

  private getFirstTransaction(): TransactionModel {
    const first = _.first(this._transactions)
    if (first) {
      return first
    } else {
      throw new Error('Transaction group must have at least 1 transaction')
    }
  }

  // endregion private
}

export default TransactionGroupModel