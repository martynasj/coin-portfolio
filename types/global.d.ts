import { RootStore as RootStoreClass } from '../src/app/stores/RootStore'
import * as Stores from '../src/app/stores'

/** Global definitions for developement **/

// for style loader
declare module '*.css' {
  const styles: any;
  export = styles;
}

// types that are accessible on the global scope
declare global {
  type RootStore = RootStoreClass
  type PortfolioStore = Stores.PortfolioStore
  type TickerStore = Stores.TickerStore

  // These types are returned from our api service (not necessary what is stored in the database)
  namespace Api {
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
    }

    export interface PortfolioItemEdit {
      numberOfUnits?: number
      pricePerUnitPaidUSD?: number
    }

    // should this be under Api namespace?
    // this is used when creating from the client
    export interface PortfolioItemNew {
      symbolId: string
      numberOfUnits: number
      pricePerUnitPaidUSD: number
      exchange: string
    }

    // this is returned item from the server
    export interface PortfolioItem extends PortfolioItemNew {
      id: string
    }

    // these two seem a bit confusing (naming)
    export interface PortfolioOnly {
      id: string
      name: string
    }

    export interface Portfolio extends PortfolioOnly {
      lock?: string
      items: PortfolioItem[]
    }
  }
}
