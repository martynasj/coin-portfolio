import { PriceMode } from '../app/stores/SettingsStore'
import { TickerStore } from '../app/stores'

type Options = {
  priceMode?: PriceMode
}

// todo: refactor this
export function createRootStore(options: Options = {}): RootStore {
  const mockStore = {
    settings: {
      priceMode: options.priceMode || 'usd',
    },
  } as RootStore
  mockStore.tickers = new TickerStore(mockStore, {} as any)
  return mockStore as RootStore
}