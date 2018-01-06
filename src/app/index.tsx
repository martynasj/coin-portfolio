import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import { Router, Route, Switch } from 'react-router';
import { Root } from './containers/Root';
import { PortfolioView } from './containers/PortfolioView'
import { createStores } from './stores';
import { ApiService } from './api'

const history = createBrowserHistory()
const stores = createStores(history)

ApiService.initWsConnection()

// render react DOM
ReactDOM.render(
  <Provider {...stores} >
    <Root>
      <Router history={history} >
        <Switch>
          <Route path="/p/:id" component={PortfolioView} />
          <Route path="/" component={PortfolioView} />
        </Switch>
      </Router>
    </Root>
  </Provider >,
  document.getElementById('root')
);