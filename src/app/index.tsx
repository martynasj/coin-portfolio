import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { Router, Route, Switch } from 'react-router';
import { Root } from './containers/Root';
import { TodoApp } from './containers/TodoApp';
import { PortfolioView } from './containers/PortfolioView'
import { TodoModel, PortfolioItemModel } from './models';
import { TodoStore, RouterStore, PortfolioStore } from './stores';
import { STORE_TODO, STORE_ROUTER, STORE_PORTFOLIO } from './constants/stores';
import { TodoFilter } from './constants/todos';

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
const history = createBrowserHistory();
const todoStore = new TodoStore(defaultTodos);
const routerStore = new RouterStore(history);
const portfolioStore = new PortfolioStore(defaultPortfolioItems)

const rootStores = {
  [STORE_TODO]: todoStore,
  [STORE_ROUTER]: routerStore,
  [STORE_PORTFOLIO]: portfolioStore,
}

// render react DOM
ReactDOM.render(
  <Provider {...rootStores} >
    <Root>
      <Router history={history} >
        <Switch>
          <Route path="/" component={PortfolioView} />
          <Route path="/todo" component={TodoApp} />
        </Switch>
      </Router>
    </Root>
  </Provider >,
  document.getElementById('root')
);