import { useStrict } from 'mobx';
import { TodoModel, PortfolioItemModel } from '../models';
import { TodoStore, PortfolioStore, RouterStore } from './index'

export declare interface AllStores {
  portfolio: PortfolioStore
  todo: TodoStore
  router: RouterStore
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
    new PortfolioItemModel('btc', 14000),
    new PortfolioItemModel('eth', 750),
    new PortfolioItemModel('xrp', 0.35),
  ]

  // prepare MobX stores
  const todoStore = new TodoStore(defaultTodos);
  const routerStore = new RouterStore(history);
  const portfolioStore = new PortfolioStore(defaultPortfolioItems)

  return {
    todo: todoStore,
    router: routerStore,
    portfolio: portfolioStore,
  }
}