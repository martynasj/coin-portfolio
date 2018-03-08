import { tickersById } from '../../mock/tickers'
import { transactions } from '../../mock/transactions'
import { PriceMode } from '../stores/SettingsStore'
import { TransactionModel, TickerModel } from '../models'

const mockTransaction = transactions[0]

function createStore(priceMode: PriceMode): RootStore {
  const mockStore = {
    settings: {
      priceMode,
    },
  }
  return mockStore as RootStore
}

function createTicker(): TickerModel {
  return TickerModel.createFromApi({} as any, tickersById.ltc)
}

describe('TransactionModel', () => {
  it('Total buy value in usd', () => {
    const store = createStore('usd')
    const transaction = TransactionModel.createFromApi(store, mockTransaction)
    expect(transaction.getCalculatedTotalValue()).toBe(637.5)
  })

  it('Total buy value in crypto', () => {
    const store = createStore('crypto')
    const transaction = TransactionModel.createFromApi(store, mockTransaction)
    expect(transaction.getCalculatedTotalValue()).toBe(0.75)
  })

  it('Trading pair', () => {
    const store = createStore('crypto')
    const transaction = TransactionModel.createFromApi(store, mockTransaction)
    expect(transaction.tradingPair).toBe('LTC/ETH')
  })

  it('Does not have current total value without ticker', () => {
    const store = createStore('crypto')
    const transaction = TransactionModel.createFromApi(store, mockTransaction)
    expect(transaction.currentTotalValue).toBe(null)
  })

  it('Current total value in crypto', () => {
    const store = createStore('crypto')
    const transaction = TransactionModel.createFromApi(store, mockTransaction)
    transaction.setTicker(createTicker())
    expect(transaction.currentTotalValue).toBeCloseTo(0.93, 5)
  })

  it('Current total value in usd', () => {
    const store = createStore('usd')
    const transaction = TransactionModel.createFromApi(store, mockTransaction)
    transaction.setTicker(createTicker())
    expect(transaction.currentTotalValue).toBeCloseTo(798.8, 5)
  })

  it('Delta in crypto mode', () => {
    const store = createStore('crypto')
    const transaction = TransactionModel.createFromApi(store, mockTransaction)
    transaction.setTicker(createTicker())
    expect(transaction.deltaPercentage).toBeCloseTo(24, 5)
  })

  it('Delta in usd mode', () => {
    const store = createStore('usd')
    const transaction = TransactionModel.createFromApi(store, mockTransaction)
    transaction.setTicker(createTicker())
    expect(transaction.deltaPercentage).toBeCloseTo(25.30196, 5)
  })
})
