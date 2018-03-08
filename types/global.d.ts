import { RootStore as RootStoreClass } from 'stores/RootStore'
import * as Stores from 'stores'

// types that are accessible on the global scope
declare global {
  type RootStore = RootStoreClass
  type PortfolioStore = Stores.PortfolioStore
  type TickerStore = Stores.TickerStore
  type SettingsStore = Stores.SettingsStore
  type UserStore = Stores.UserStore
  type RouterStore = Stores.RouterStore
  type UIStore = Stores.UIStore
  type ModalStore = Stores.ModalStore

  type TransactionType = 'buy' | 'sell'

  // These types are returned from our api service (not necessary what is stored in the database)
  namespace Api {
    export interface User {
      id: string
      email: string | null
      emailVerified: boolean
      isAnonymous: boolean
    }

    export interface Ticker {
      id: string
      symbol: string
      name: string
      priceUSD?: number
      priceBTC?: number
      bitfinex?: ExchangeTicker
      bittrex?: ExchangeTicker
      kraken?: ExchangeTicker
      binance?: ExchangeTicker
      poloniex?: ExchangeTicker
      gdax?: ExchangeTicker
      coinexchange?: ExchangeTicker
    }

    export interface ExchangeTicker {
      priceUSD?: number
      priceBTC?: number
      priceETH?: number
      priceLTC?: number
    }

    export interface TransactionEdit {
      type?: TransactionType
      exchangeId?: string
      symbolId?: string
      numberOfUnits?: number
      unitPrice?: number
      baseSymbolId?: string
      baseSymbolPriceUsd?: number
      transactionDate?: Date
    }

    export interface TransactionNew {
      type: TransactionType
      exchangeId: string
      symbolId: string
      numberOfUnits: number
      unitPrice: number
      baseSymbolId: string
      baseSymbolPriceUsd: number
      transactionDate: Date
    }

    // this is returned item from the server
    export interface Transaction extends TransactionNew {
      id: string
      createdAt: Date
    }

    // these two seem a bit confusing (naming)
    export interface PortfolioOnly {
      id: string
      name: string
      ownerId: string
    }

    export interface Portfolio extends PortfolioOnly {
      items: Transaction[]
    }
  }
}
