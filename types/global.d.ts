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

  namespace Api {
    export interface Ticker {
      id: string
      symbol: string
      name: string
      priceUSD: number
    }

    export interface Portfolio {
      id: string
      name: string
    }
  }
}
