import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createRenderer } from 'fela'
import monolithic from 'fela-monolithic'
import { Provider as CSSProvider } from 'react-fela'
import { createBrowserHistory } from 'history'
import { Provider } from 'mobx-react'
import { Router, Route, Switch, Redirect } from 'react-router'
import { Root } from './containers/Root'
import HomeView from './containers/HomeView'
import CreatePortfolioView from './containers/CreatePortfolioView'
import LoginView from './containers/LoginView'
import DashboardView from './containers/DashboardView'
import { createStores } from './stores'
import { ApiService } from './api'

const cssRenderer = createRenderer({
  enhancers: [monolithic({ prettySelectors: true })], // weird stuff, multiple classes are rendered in wrong order when NOT using monolithic :(
})
const history = createBrowserHistory()

const apiService = new ApiService()
apiService.initWsConnection()

const stores = createStores(history, apiService)

// render react DOM
ReactDOM.render(
  <Provider {...stores}>
    <CSSProvider renderer={cssRenderer}>
      <Root>
        <Router history={history}>
          <Switch>
            <Route path="/create-portfolio" component={CreatePortfolioView} />
            <Route
              path="/login"
              render={props => {
                const isAuthenticated = !!stores.user.currentUser
                return isAuthenticated ? <Redirect to="/dashboard" /> : <Route {...props} component={LoginView} />
              }}
            />
            <Route
              path="/dashboard"
              render={props => {
                const isAuthenticated = !!stores.user.currentUser
                return isAuthenticated ? <Route {...props} component={DashboardView} /> : <Redirect to="/login" />
              }}
            />
            <Route path="/home" component={HomeView} />
            <Route
              path="/"
              render={() => {
                const isAuthenticated = !!stores.user.currentUser
                return isAuthenticated ? <Redirect to="/dashboard" /> : <Redirect to="/home" />
              }}
            />
          </Switch>
        </Router>
      </Root>
    </CSSProvider>
  </Provider>,
  document.getElementById('root')
)
