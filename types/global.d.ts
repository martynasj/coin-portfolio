import { RootStore as RootStoreClass } from '../src/app/stores/RootStore'

/** Global definitions for developement **/

// for style loader
declare module '*.css' {
  const styles: any;
  export = styles;
}

// types that are accessible on the global scope
declare global {
  type RootStore = RootStoreClass

  namespace Api {
    export interface Ticker {
      id: string
      symbol: string
      name: string
      priceUSD: number
    }
  }
}
