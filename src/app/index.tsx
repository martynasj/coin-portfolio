import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRenderer } from 'fela'
import { Provider as CSSProvider } from 'react-fela'
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import { Router, Route, Switch } from 'react-router';
import { Root } from './containers/Root';
import HomeView from './containers/HomeView'
import CreatePortfolioView from './containers/CreatePortfolioView'
import LoginView from './containers/LoginView'
import DashboardView from './containers/DashboardView'
import { createStores } from './stores';
import { ApiService } from './api'
import '../assets/normalize.css'
import './global.css'

ApiService.initWsConnection()

const cssRenderer = createRenderer()
const history = createBrowserHistory()
const stores = createStores(history)

// render react DOM
ReactDOM.render(
  <Provider {...stores} >
    <CSSProvider renderer={cssRenderer}>
      <Root>
        <Router history={history} >
          <Switch>
            <Route path="/create-portfolio" component={CreatePortfolioView} />
            <Route path="/login" component={LoginView} />
            <Route path="/dashboard" component={DashboardView} />
            <Route path="/" component={HomeView} />
          </Switch>
        </Router>
      </Root>
    </CSSProvider>
  </Provider >,
  document.getElementById('root')
);