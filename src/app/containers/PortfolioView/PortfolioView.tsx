import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Box } from 'reflexbox'
import { Text } from '../../components'
import { TotalsPanel } from '../../components/TotalsPanel'
import PortfolioItemsList from './PortfolioItemsList'
import CreateNewItemView from '../CreateNewItemView'
import TransactionView from '../TransactionView'
import Toolbar from '../Toolbar'
import { roundCurrency } from '../../util/number-formatting'
import fav16 from '../../../assets/favicon-16x16.png'
import { theme } from '../../theme'

interface OwnProps {
  id: string
}

interface Props extends OwnProps, InjectedProps, RouteComponentProps<any> {}

interface InjectedProps {
  portfolio?: PortfolioStore
  tickers?: TickerStore
  modal?: ModalStore
}

@inject((allStores: RootStore) => ({
  portfolio: allStores.portfolio,
  tickers: allStores.tickers,
  modal: allStores.modal,
}))
@observer
class PortfolioView extends React.Component<Props> {
  componentWillMount() {
    this.props.portfolio!.syncPortfolio(this.props.id)
  }

  componentWillUnmount() {
    this.props.portfolio!.unsyncPortfolio()
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.id !== this.props.id) {
      this.props.portfolio!.unsyncPortfolio()
      this.props.portfolio!.syncPortfolio(nextProps.id)
    }
  }

  renderLoading = () => {
    return <div>Loading</div>
  }

  renderNotFound = () => {
    return (
      <Box pt={3} px={2}>
        <Text light center>
          This shitcoin bag does not exist
        </Text>
        <Text light center>
          Go ahead. Take that slug
        </Text>
      </Box>
    )
  }

  renderTotalsPanel = () => {
    const portfolio = this.props.portfolio!
    return (
      <TotalsPanel
        worth={portfolio.totalWorth}
        invested={portfolio.totalInitialWorth}
        change={portfolio.change}
        changePercentage={portfolio.changePercentage}
      />
    )
  }

  renderDocumentHead = () => {
    return (
      <Helmet>
        <title>{roundCurrency(this.portfolioStore.totalWorth || 0)}</title>
        <link rel="icon" type="image/png" href={fav16} />
      </Helmet>
    )
  }

  renderToolbar = () => {
    return (
      <Box mb={2}>
        <Toolbar />
      </Box>
    )
  }

  private get portfolioStore() {
    return this.props.portfolio!
  }

  render() {
    const portfolioStore = this.portfolioStore

    if (!portfolioStore.hasLoaded) {
      return this.renderLoading()
    }

    if (portfolioStore.portfolioNotFound) {
      return this.renderNotFound()
    }

    return (
      <div style={{ backgroundColor: theme.colors.backgroundLight, minHeight: '100vh' }}>
        <Route path={`/dashboard/:portfolioId/add-item`} component={CreateNewItemView} />
        {this.renderDocumentHead()}
        {this.renderTotalsPanel()}
        <Box
          style={{
            width: '95%',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {this.renderToolbar()}
          <Switch>
            <Route path={`/dashboard/:portfolioId/item/:groupId`} component={TransactionView} />
            <Route component={PortfolioItemsList} />
          </Switch>
        </Box>
      </div>
    )
  }
}

export default withRouter<OwnProps>(PortfolioView)
