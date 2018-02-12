// import { PortfolioStore, RootStore } from './index'
import { PriceMode } from '../stores/SettingsStore'
import { TransactionModel, TickerModel } from '../models'

const mockTransaction: Api.Transaction = {
  id: 'a',
  exchangeId: 'bitfinex',
  type: 'buy',
  symbolId: 'ltc',
  numberOfUnits: 5,
  unitPrice: 0.15,
  baseSymbolId: 'eth',
  baseSymbolPriceUsd: 850,
  transactionDate: new Date('2017-12-22T20:31:59.096Z'),
  createdAt: new Date('2017-12-22T21:00:00.000Z'),
}

function createStore(priceMode: PriceMode): RootStore {
  const mockStore = {
    settings: {
      priceMode,
    },
  }
  return mockStore as RootStore
}

function createTicker(): TickerModel {
  const mockTicker: Api.Ticker = {
    id: 'ltc',
    symbol: 'ltc',
    name: 'Litecoin',
    priceUSD: 161.6,
    priceBTC: 0.01872,
    bitfinex: {
      priceBTC: 0.0182,
      priceETH: 0.186,
      priceUSD: 159.76,
    },
  }
  return TickerModel.createFromApi({} as any, mockTicker)
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
})
