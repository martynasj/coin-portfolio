import { observable, action } from 'mobx'
import { PairModel } from './index'

type BaseCurrency = string

export default class TickerModel {
  private tickerStore: TickerStore
  id: string
  name: string
  @observable private _priceUSD?: number
  @observable private _priceBTC?: number
  bitfinex?: Api.ExchangeTicker
  bittrex?: Api.ExchangeTicker
  kraken?: Api.ExchangeTicker
  binance?: Api.ExchangeTicker
  gdax?: Api.ExchangeTicker
  poloniex?: Api.ExchangeTicker
  coinexchange?: Api.ExchangeTicker

  private constructor(tickerStore: TickerStore, ticker: Api.Ticker) {
    this.tickerStore = tickerStore
    this.id = ticker.id
    this.name = ticker.name
    this._priceUSD = ticker.priceUSD
    this._priceBTC = ticker.priceBTC
    this.bitfinex = ticker.bitfinex
    this.bittrex = ticker.bittrex
    this.kraken = ticker.kraken
    this.binance = ticker.binance
    this.gdax = ticker.gdax
    this.coinexchange = ticker.coinexchange
    this.poloniex = ticker.poloniex
  }

  public static create(tickerStore: TickerStore, tickerOpts) {
    return new TickerModel(tickerStore, tickerOpts)
  }

  public static createFromApi(tickerStore: TickerStore, ticker: Api.Ticker) {
    return new TickerModel(tickerStore, ticker)
  }

  private get priceUSD(): number|null {
    return this._priceUSD || null
  }

  private get priceBTC(): number|null {
    return this._priceBTC || null
  }

  get symbol() {
    return this.id.toUpperCase()
  }

  public getPrice(base: BaseCurrency, exchangeId?: string|null, fallbackToDefault?: boolean): number|null {
    const baseCurrency = base.toUpperCase() 

    if (!exchangeId) {
      return this[`price${baseCurrency}`]
    }

    const exchangeTicker: Api.ExchangeTicker = this[exchangeId]

    if (exchangeTicker) {
      const price = exchangeTicker[`price${baseCurrency}`] || null
      if (fallbackToDefault) {
        return price || this[`price${baseCurrency}`] || null
      } else {
        return price
      }
    } else if (fallbackToDefault) {
      return this[`price${baseCurrency}`] || null
    } else {
      return null
    }
  }

  public getPriceUSD(exchangeId?: string|null, fallbackToDefault?: boolean): number|null {
    return this.getPrice('usd', exchangeId, fallbackToDefault)
  }

  public getPriceBTC(exchangeId?: string|null, fallbackToDefault?: boolean): number|null {
    return this.getPrice('btc', exchangeId, fallbackToDefault)
  }

  public getSupportedExchangeIds(): string[] {
    const allExchangeIds = this.tickerStore.getSupportedExchangeIds()
    return Object.keys(this).filter(key => {
      return allExchangeIds.includes(key) && this[key]
    })
  }

  public getPairs(exchangeId: string): PairModel[] {
    const exchangeTicker: Api.ExchangeTicker|undefined = this[exchangeId]
    if (exchangeTicker) {
      return Object.keys(exchangeTicker).map(currency => {
        return new PairModel({
          symbolId: this.id,
          baseSymbolId: currency.replace('price', '').toLowerCase(),
          price: exchangeTicker[currency],
        })
      })
    } else {
      return []
    }
  }

  /**
   * When ticker (exchange ticker) doesn't have a price listed in USD
   * This is our best effort to calculate this price based on btc or eth price
   */
  public getCalculatedPriceInUSD(exchangeId?: string|null): number|null {
    const priceUSD = this.getPriceUSD(exchangeId)
    const priceBTC = this.getPriceBTC(exchangeId)

    if (priceUSD) {
      return priceUSD
    } else {
      const btcPriceInUSD = this.tickerStore.getBTCPriceInUSD(exchangeId || null, true)
      if (priceBTC && btcPriceInUSD) {
        return priceBTC * btcPriceInUSD
      }
      // todo: make a second guess based on eth price
      return null
    }
  }

  @action
  setPriceUSD(price: number) {
    this._priceUSD = price
  }
}