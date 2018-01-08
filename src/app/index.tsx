import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRenderer } from 'fela'
import { Provider as CSSProvider } from 'react-fela'
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import { Router, Route, Switch } from 'react-router';
import { Root } from './containers/Root';
import { PortfolioView } from './containers/PortfolioView'
import { createStores } from './stores';
import { ApiService } from './api'
import './global.css'

const cssRenderer = createRenderer()
const history = createBrowserHistory()
const stores = createStores(history)

ApiService.initWsConnection()

// render react DOM
ReactDOM.render(
  <Provider {...stores} >
    <CSSProvider renderer={cssRenderer}>
      <Root>
        <Router history={history} >
          <Switch>
            <Route path="/p/:id" component={PortfolioView} />
            <Route path="/" component={PortfolioView} />
          </Switch>
        </Router>
      </Root>
    </CSSProvider>
  </Provider >,
  document.getElementById('root')
);