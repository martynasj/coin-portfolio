/** Global definitions for developement **/

// for style loader
declare module '*.css' {
  const styles: any;
  export = styles;
}

declare namespace Api {
  export interface Ticker {
    id: string
    symbol: string
    name: string
    priceUSD: number
  }
}