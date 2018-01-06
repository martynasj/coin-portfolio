import { runInAction, action } from 'mobx'
import { TickerModel } from '../models'
import { ApiService } from '../api'

export class TickerStore {

  public tickers: { [id: string]: TickerModel } = {}

  @action
  public async fetchTicker(symbol: string) {
    const ticker = await ApiService.ticker.getTicker(symbol)
    runInAction(() => {
      this.tickers.symbol = TickerModel.createFromApi(ticker)
    })
  }

}