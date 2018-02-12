import { transactions } from '../../../mock/transactions'
import { tickersById } from '../../../mock/tickers'
import { PriceMode } from '../stores/SettingsStore'
import { TransactionGroupModel, TransactionModel, TickerModel } from './index'

function createStore(priceMode: PriceMode): RootStore {
  const mockStore = {
    settings: {
      priceMode,
    },
  }
  return mockStore as RootStore
}

function createTransactions(store: RootStore): TransactionModel[] {
  const ticker = TickerModel.createFromApi({} as any, tickersById.ltc)
  return transactions.map(t => {
    const model = TransactionModel.createFromApi(store, t)
    model.setTicker(ticker)
    return model
  })
}

function createTransactionGroup(): TransactionGroupModel {
  const store = createStore('usd')
  const transactions = createTransactions(store)
  return new TransactionGroupModel(store, transactions)
}

describe('TransactionGroupModel', () => {
  it('All time profit in usd', () => {
    const group = createTransactionGroup()
    expect(group.totalProfit).toBeCloseTo(-163.2, 3)
  })

  it('All time profit in crypto', () => {
    // todo
  })

  it('Average buy price in usd', () => {
    const group = createTransactionGroup()
    expect(group.averageBuyPrice).toBe(69.6)
  })

  it('Average buy price in crypto', () => {
    // todo
  })

  it('Average sell price in usd', () => {
    const group = createTransactionGroup()
    expect(group.averageSellPrice).toBe(8.2)
  })

  it('Average sell price in crypto', () => {})

  it('Total units holding', () => {
    const group = createTransactionGroup()
    expect(group.totalUnitsHold).toBe(5)
  })

  it('Total hold value (market value) in usd', () => {
    const group = createTransactionGroup()
    expect(group.currentTotalHoldValue).toBe(798.8)
  })

  it('Net cost in usd', () => {
    const group = createTransactionGroup()
    expect(group.netCost).toBe(962)
  })
})
