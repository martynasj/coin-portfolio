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

  public getThumbIconUrl(): string|undefined {
    const ticker = this.getTicker()
    return ticker ? ticker.thumbUrl : undefined
  }

  public get transactions(): TransactionModel[] {
    return _.orderBy(this._transactions, t => t.transactionDate.getTime(), ['desc'])
  }

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

  public get currentUnitPrice(): number | null {
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

  /**
   * Current market value of all held assets
   */
  public get currentTotalHoldValue(): number | null {
    if (this.currentUnitPrice) {
      return this.currentUnitPrice * this.totalUnitsHold
    } else {
      return null
    }
  }

  /**
   * How much did it cost to acquire all the current holdings
   * If there are any profitable sell transactions, this price may get to 0
   */
  public get netCost(): number {
    const netCost = this.transactions.reduce((r, t) => {
      if (t.type === 'buy') {
        return r + t.getCalculatedTotalValue()
      } else {
        return r - t.getCalculatedTotalValue()
      }
    }, 0)
    return netCost < 0 ? 0 : netCost
  }

  /**
   * Amount that was spent to acquire all the current assets in hold
   */
  public get totalHoldCost(): number | null {
    if (this.averageBuyPrice) {
      return this.averageBuyPrice * this.totalUnitsHold
    } else {
      return null
    }
  }

  /**
   * Profit made by holding all the current assets
   */
  public get totalHoldProfit(): number | null {
    if (this.currentTotalHoldValue && this.totalHoldCost) {
      return this.currentTotalHoldValue - this.totalHoldCost
    } else {
      return null
    }
  }

  /**
   * Profit made by selling assets
   */
  public get totalSellProfit(): number | null {
    if (this.averageSellPrice && this.averageBuyPrice) {
      return (this.averageSellPrice - this.averageBuyPrice) * this.totalUnitsSold
    } else {
      return null
    }
  }

  /**
   * Profit made by selling and holding assets
   */
  public get totalProfit(): number | null {
    if (this.totalHoldProfit || this.totalSellProfit) {
      if (!this.totalSellProfit) {
        return this.totalHoldProfit
      }
      if (!this.totalHoldProfit) {
        return this.totalSellProfit
      }
      return this.totalHoldProfit + this.totalSellProfit
    } else {
      return null
    }
  }

  // Still no good when there are sell transactions
  public getTotalProfitDelta(): number | null {
    if (this.totalHoldCost && this.currentTotalHoldValue) {
      return (this.currentTotalHoldValue / this.totalHoldCost - 1) * 100
    } else {
      return null
    }
  }

  // actions

  // endregion public

  // region private

  private getTicker(): TickerModel | null {
    const first = this.getTransaction()
    return first.ticker
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
