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

  // todo: double check
  public get totalUnitsSold(): number {
    return _.reduce(
      this._transactions,
      (r, t) => {
        if (t.type === 'sell') {
          return r + t.numberOfUnits
        } else {
          return r
        }
      },
      0
    )
  }

  // todo: double check
  public get totalUnitsHold(): number {
    return _.reduce(
      this._transactions,
      (r, t) => {
        if (t.type === 'buy') {
          return r + t.numberOfUnits
        } else {
          return r - t.numberOfUnits
        }
      },
      0
    )
  }

  public get currentPrice(): number | null {
    const transaction = this.getTransaction()
    return transaction.getCalculatedCurrentUnitPrice()
  }

  public get averageBuyPrice(): number | null {
    if (this.isCryptoMode()) {
      // todo: what return?
      return null
    } else {
      const buyTransactions = _.filter(this.transactions, t => t.type === 'buy')
      if (!buyTransactions.length) {
        return null
      } else {
        const totalPaid = buyTransactions.reduce((r, t) => r + t.getCalculatedTotalValue(), 0)
        const totalUnits = buyTransactions.reduce((r, t) => r + t.numberOfUnits, 0)
        return totalPaid / totalUnits
      }
    }
  }

  public get averageSellPrice(): number | null {
    if (this.isCryptoMode()) {
      // todo
      return null
    } else {
      const sellTransactions = _.filter(this.transactions, t => t.type === 'sell')
      if (!sellTransactions.length) {
        return null
      } else {
        const totalSell = sellTransactions.reduce((r, t) => r + t.getCalculatedTotalValue(), 0)
        const totalUnits = sellTransactions.reduce((r, t) => r + t.numberOfUnits, 0)
        return totalSell / totalUnits
      }
    }
  }

  public get marketValue(): number | null {
    if (this.currentPrice) {
      return this.currentPrice * this.totalUnitsHold
    } else {
      return null
    }
  }

  // todo: may be incorrect
  public get netCost(): number {
    return this.transactions.reduce((r, t) => {
      if (t.type === 'buy') {
        return r + t.getCalculatedTotalValue()
      } else {
        return r - t.getCalculatedTotalValue()
      }
    }, 0)
  }

  public get totalHoldProfit(): number | null {
    if (this.marketValue) {
      return this.marketValue - this.netCost
    } else {
      return null
    }
  }

  /**
   * Total profits made from sell transactions
   */
  // todo: double check
  public get totalSellProfit(): number | null {
    if (this.averageSellPrice && this.averageBuyPrice) {
      return (this.averageSellPrice - this.averageBuyPrice) * this.totalUnitsSold
    } else {
      return null
    }
  }

  /**
   * Combined all sell and holding profits
   */
  // todo: double check
  public get totalProfit(): number | null {
    if (this.totalHoldProfit && this.totalSellProfit) {
      return this.totalHoldProfit + this.totalSellProfit
    } else {
      return null
    }
  }

  // actions

  // endregion public

  // region private

  private getTicker(): TickerModel | null {
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
