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
      priceUSD: number
    }

    export interface PortfolioItem {
      id: string
      symbolId: string
      numberOfUnits: number
      pricePerUnitPaidUSD: number
    }

    export interface PortfolioOnly {
      id: string
      name: string
    }

    export interface Portfolio extends PortfolioOnly {
      items: PortfolioItem[]
    }
  }
}
