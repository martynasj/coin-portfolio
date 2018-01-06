import { useStrict } from 'mobx';
import { TodoModel, PortfolioItemModel } from '../models';
import * as Stores from './index'

export declare interface AllStores {
  portfolio: Stores.PortfolioStore
  router: Stores.RouterStore
  ticker: Stores.TickerStore
}

export function createStores(history): AllStores {
    // enable MobX strict mode
  useStrict(true);

  // default fixtures for TodoStore
  const defaultTodos = [
    new TodoModel('Use Mobx'),
    new TodoModel('Use React', true),
  ];

  const defaultPortfolioItems = [
    new PortfolioItemModel('btc', 14000, 0.15),
    new PortfolioItemModel('eth', 750, 3.99),
    new PortfolioItemModel('xrp', 0.35, 500),
  ]

  // prepare MobX stores
  const routerStore = new Stores.RouterStore(history)
  const portfolioStore = new Stores.PortfolioStore(defaultPortfolioItems)
  const tickerStore = new Stores.TickerStore()

  return {
    router: routerStore,
    portfolio: portfolioStore,
    ticker: tickerStore,
  }
}