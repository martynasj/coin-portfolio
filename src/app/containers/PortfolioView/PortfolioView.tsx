import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Route, withRouter, RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Box, Flex } from 'reflexbox'
import { TransactionGroupModel } from '../../models'
import { Button, Text } from '../../components'
import { PortfolioItem } from '../../components/PortfolioItem'
import { TotalsPanel } from '../../components/TotalsPanel'
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
}

@inject((allStores: RootStore) => ({
  portfolio: allStores.portfolio,
  tickers: allStores.tickers,
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

  private handleAddItemClick = () => {
    // todo: abstract this
    this.props.history.push(`${this.props.location.pathname}/add-item`)
  }

  private handleItemClick = (item: TransactionGroupModel) => {
    // todo: abstract this
    this.props.history.push(`${this.props.location.pathname}/item/${item.id}`)
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

  render() {
    const { portfolio } = this.props

    if (!portfolio!.hasLoaded) {
      // return this.renderLoading()
    }

    if (portfolio!.portfolioNotFound) {
      // return this.renderNotFound()
    }

    return (
      <div style={{ backgroundColor: theme.colors.backgroundLight, minHeight: '100vh' }}>
        <Route path={`/dashboard/:portfolioId/add-item`} component={CreateNewItemView} />
        <Helmet>
          <title>{roundCurrency(portfolio!.totalWorth || 0)}</title>
          <link rel="icon" type="image/png" href={fav16} />
        </Helmet>

        <Box mb={2} style={{ backgroundColor: theme.colors.white }}>
          <Box
            style={{
              width: '95%',
              maxWidth: '900px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <Box
              style={{
                paddingLeft: '35px',
                paddingRight: '35px',
              }}
            >
              <TotalsPanel
                worth={portfolio!.totalWorth}
                invested={portfolio!.totalInitialWorth}
                change={portfolio!.change}
                changePercentage={portfolio!.changePercentage}
              />
              <Flex justify="flex-start">
                <Button
                  onClick={this.handleAddItemClick}
                  style={{
                    position: 'relative',
                    bottom: '-17px',
                  }}
                >
                  Add Coin +
                </Button>
              </Flex>
            </Box>
          </Box>
        </Box>

        <Box
          style={{
            width: '95%',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <Route path={`/dashboard/:portfolioId/item/:groupId`} component={TransactionView} />
          <Flex
            justify="flex-end"
            style={{
              margin: '10px 15px',
              paddingLeft: '35px',
              paddingRight: '35px',
            }}
          >
            <Toolbar/>
          </Flex>        
          {portfolio!.getTransactionGroups().map(item => {
            return (
              <div key={item.id}>
                <PortfolioItem
                  symbol={item.symbolId}
                  name={item.getTickerFullName()}
                  buyPrice={item.averageBuyPrice || 0}
                  currentPrice={item.currentPrice}
                  numberOfUnits={item.totalUnits}
                  profit={item.totalProfit}
                  changePercentage={0}
                  netCost={item.netCost}
                  marketValue={item.marketValue}
                  onClick={() => this.handleItemClick(item)}
                />
              </div>
            )
          })}
        </Box>
      </div>
    )
  }
}

export default withRouter<OwnProps>(PortfolioView)
