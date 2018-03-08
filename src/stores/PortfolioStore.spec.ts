import { PortfolioStore } from './PortfolioStore'
import { transactions } from '../../mock/transactions'
import { tickersById } from '../../mock/tickers'
import { TransactionModel, TickerModel } from '../models'
import { createRootStore } from '../test/utils'

function setupStore() {
  const rootStore = createRootStore()
  rootStore.tickers.setTickers([TickerModel.createFromApi(rootStore.tickers, tickersById.ltc)])

  function createTransactions(transactions: Api.Transaction[]): TransactionModel[] {
    return transactions.map(t => {
      const transaction = TransactionModel.createFromApi(rootStore, t)
      transaction.setTicker(TickerModel.createFromApi(rootStore.tickers, tickersById.ltc))
      return transaction
    })
  }

  const store = new PortfolioStore(rootStore, {} as any)
  store.setTransactions(createTransactions(transactions))
  return store
}

describe('PortfolioStore', () => {
  it('Makes transaction groups', () => {
    const store = setupStore()
    const groups = store.getTransactionGroups()
    expect(groups).toHaveLength(1)
  })

  it('Total hold worth', () => {
    const portfolioStore = setupStore()
    const totalWorth = portfolioStore.totalHoldWorth
    expect(totalWorth).toBe(798.8)
  })

  it('Calculates stake percentage of transaction group', () => {
    // todo
  })
})
