import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Router, Route, Switch } from 'react-router';
import { Root } from './containers/Root';
import { TodoApp } from './containers/TodoApp';
import { PortfolioView } from './containers/PortfolioView'
import { createStores } from './stores';

const stores = createStores()

// render react DOM
ReactDOM.render(
  <Provider {...stores} >
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