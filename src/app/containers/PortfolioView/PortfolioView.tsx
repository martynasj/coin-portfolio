import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { RouteComponentProps, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Flex, Box } from 'reflexbox'
import { TransactionModel } from '../../models'
import { Button, Text } from '../../components'
import { PortfolioItem } from '../../components/PortfolioItem'
import { TotalsPanel } from '../../components/TotalsPanel'
import CreateNewItemView from '../CreateNewItemView'
import TransactionView from '../TransactionView'
import Toolbar from '../Toolbar'
import { roundCurrency } from '../../util/number-formatting'
import { theme } from '../../theme'

interface Props extends RootStore, RouteComponentProps<{ id: string }> {}

@inject((allStores: RootStore) => ({
  portfolio: allStores.portfolio,
  tickers: allStores.tickers,
}))
@observer
export class PortfolioView extends React.Component<Props> {

  componentWillMount() {
    // this.props.portfolio.syncPortfolio(this.props.match.params.id)
  }

  componentWillUnmount() {
    // this.props.portfolio.unsyncPortfolio()
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      // this.props.portfolio.unsyncPortfolio()
      // this.props.portfolio.syncPortfolio(nextProps.match.params.id)
    }
  }

  private handleAddItemClick = () => {
    this.props.history.push(`${this.props.match.url}/add-item`)
  }

  private handleEdit = (item: TransactionModel) => {
    this.props.history.push(`${this.props.match.url}/item/${item.id}`)
  }

  renderLoading = () => {
    return (
      <div>Loading</div>
    )
  }

  renderNotFound = () => {
    return (
      <Box pt={3} px={2}>
        <Text light center>This shitcoin bag does not exist</Text>
        <Text light center>Go ahead. Take that slug</Text>
      </Box>
    )
  }

  render() {
    const { portfolio, tickers, match } = this.props

    // if (!portfolio.hasLoaded) {
    //   return this.renderLoading()
    // }

    // if (portfolio.portfolioNotFound) {
    //   return this.renderNotFound()
    // }

    return (
      <div>
        <Route path={`${match.url}/add-item`} component={CreateNewItemView} />
        <Helmet>
          <title>
            {roundCurrency(portfolio.totalWorth || 0)}
          </title>
        </Helmet>

        <Box
          mb={2}
          style={{ backgroundColor: '#ffffff' }}
        >
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
              <Flex align='center' justify='space-between'>
                <h1
                  style={{
                    fontSize: '0.9rem',
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    color: theme.colors.neutral2,
                  }}
                >
                 {portfolio.name}
                </h1>
                <Toolbar />
              </Flex>
              <TotalsPanel
                worth={portfolio.totalWorth}
                invested={portfolio.totalInitialWorth}
                change={portfolio.change}
                changePercentage={portfolio.changePercentage}
              />
              <div
                style={{
                  textAlign: 'center',
                }}
              >
                <Button
                  onClick={this.handleAddItemClick}
                  style={{
                    marginBottom: '15px',
                    backgroundColor: theme.colors.neutral1,
                  }}
                >
                  Add Coin +
                </Button>
              </div>
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
          <Route path={`${match.url}/item/:groupId`} component={TransactionView} />        
          {portfolio.getTransactionGroups().map(item => {
            return (
              <div key={item.id}>
                <PortfolioItem
                  symbol={item.symbolId}
                  name={item.getTickerFullName()}
                  buyPrice={item.pricePerUnitPaid}
                  currentPrice={item.currentPrice}
                  numberOfUnits={item.totalUnits}
                  change={item.change}
                  changePercentage={item.changePercentage}
                  totalBuyValue={item.totalBuyValue}
                  totalValue={item.currentTotalValue}
                  onClick={() => this.handleEdit(item)}
                />
              </div>
            )
          })}
        </Box>
      </div>
    )
  }
}