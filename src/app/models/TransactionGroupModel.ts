import _ from 'lodash'
import { TransactionModel, TickerModel } from '../models'

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
    return this.getTransaction().symbolId
  }

  public get symbolId(): string {
    return this.getTransaction().symbolId
  }

  public getTickerFullName(): string {
    const ticker = this.getTicker()
    if (ticker) {
      return ticker.name
    } else {
      return '[NO TICKER]'
    }
  }

  public get transactions(): TransactionModel[] {
    return _.orderBy(this._transactions, t => t.transactionDate.getTime(), ['desc'])
  }

  public get totalUnits(): number {
    return _.reduce(this._transactions, (r, t) => {
      if (t.type === 'buy') {
        return r + t.numberOfUnits
      } else {
        return r - t.numberOfUnits
      }
    }, 0)
  }

  public get currentPrice(): number|null {
    const transaction = this.getTransaction()
    return transaction.currentUnitPrice
  }

  public get averageBuyPrice(): number|null {
    if (this.isCryptoMode()) {
      // todo: what return?
      return null
    } else {
      const buyTransactions = _.filter(this.transactions, t => t.type === 'buy')
      if (!buyTransactions.length) {
        return null
      } else {
        const totalPaid = buyTransactions.reduce((r, t) => r + t.totalValue, 0)
        const totalUnits = buyTransactions.reduce((r, t) => r + t.numberOfUnits, 0)
        return totalPaid / totalUnits
      }
    }
  }

  public get averageSellPrice(): number|null {
    if (this.isCryptoMode()) {
      // todo
      return null
    } else {
      const sellTransactions = _.filter(this.transactions, t => t.type === 'sell')
      if (!sellTransactions.length) {
        return null
      } else {
        const totalSell = sellTransactions.reduce((r, t) => r + t.totalValue, 0)
        const totalUnits = sellTransactions.reduce((r, t) => r + t.numberOfUnits, 0)
        return totalSell / totalUnits
      }
    }
  }

  // actions

  // endregion public

  // region private

  private getTicker(): TickerModel|null {
    const first = this.getTransaction()
    const ticker = this.store.tickers.getTicker(first.symbolId)
    return ticker || null
  }

  private getTransaction(): TransactionModel {
    // dunno if it should be first?
    const first = _.first(this._transactions)
    if (first) {
      return first
    } else {
      throw new Error('Transaction group must have at least 1 transaction')
    }
  }

  private isCryptoMode(): boolean {
    return this.store.settings.priceMode === 'crypto'
  }

  // endregion private
}

export default TransactionGroupModel