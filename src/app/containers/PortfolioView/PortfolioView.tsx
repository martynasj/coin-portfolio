import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { RouteComponentProps, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Flex, Box } from 'reflexbox'
import { PortfolioItemModel } from '../../models'
import { Button, Text } from '../../components'
import { PortfolioItem } from '../../components/PortfolioItem'
import { TotalsPanel } from '../../components/TotalsPanel'
import CreateNewItemView from '../CreateNewItemView'
import Toolbar from '../Toolbar'
import { roundCurrency, roundPercentage } from '../../util/number-formatting'
import { theme } from '../../theme'

interface Props extends RootStore, RouteComponentProps<{ id: string }> {}

@inject((allStores: RootStore) => ({
  portfolio: allStores.portfolio,
  tickers: allStores.tickers,
}))
@observer
export class PortfolioView extends React.Component<Props> {

  componentWillMount() {
    this.initTickers()
    this.props.portfolio.syncPortfolio(this.props.match.params.id)
  }

  componentWillUnmount() {
    // unsync tickers
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.props.portfolio.syncPortfolio(nextProps.match.params.id)
    }
  }

  private initTickers = () => {
    this.props.tickers.getAllTIckers()
    this.props.tickers.syncTicker('btc')
    this.props.tickers.syncTicker('eth')
  }

  private handleAddItemClick = () => {
    this.props.history.push(`${this.props.match.url}/add-item`)
  }

  private handleEdit = (item: PortfolioItemModel) => {
    this.props.history.push(`${this.props.match.url}/item/${item.id}`)
  }

  private handleExchangeChange = (item: PortfolioItemModel, selectedExchangeId: string|null) => {
    item.exchangeId = selectedExchangeId
  }

  private handleAmountChange = (item: PortfolioItemModel, amount: number) => {
    item.numberOfUnits = amount
  }

  private handleBuyPriceChange = (item: PortfolioItemModel, price: number) => {
    item.pricePerUnitPaid = price
  }

  renderLoading = () => {
    return (
      <div>Loading</div>
    )
  }

  renderNotFound = () => {
    return (
      <div>
        <Text>This shitcoin bag does not exist</Text>
        <Text>Go ahead. Take that slug</Text>
      </div>
    )
  }

  render() {
    const { portfolio, tickers, match } = this.props

    const isUnlocked = portfolio.isUnlocked

    if (!portfolio.hasLoaded) {
      return this.renderLoading()
    }

    if (portfolio.portfolioNotFound) {
      return this.renderNotFound()
    }

    return (
      <div>
        <Route path={`${match.url}/add-item`} component={CreateNewItemView} />
        <Route path={`${match.url}/item/:id`} component={CreateNewItemView} />
        <Helmet>
          <title>
            {isUnlocked ? roundCurrency(portfolio.totalWorth || 0) : roundPercentage(portfolio.changePercentage)}
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
                locked={!isUnlocked}
              />
              {isUnlocked &&
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
              }
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
          {portfolio.items.map(item => {
            return (
              <div key={item.id}>
                <PortfolioItem
                  key={item.id}
                  symbol={item.symbolId}
                  name={item.getTickerFullName()}
                  selectedExchange={item.exchangeId}
                  supportedExchanges={tickers.getSupportedExchanges(item.symbolId)}
                  buyPrice={item.pricePerUnitPaid}
                  currentPrice={item.currentPriceUSD}
                  numberOfUnits={item.numberOfUnits}
                  change={item.change}
                  changePercentage={item.changePercentage}
                  totalBuyValue={item.totalBuyValue}
                  totalValue={item.currentTotalValue}
                  locked={!isUnlocked}
                  onExchangeChange={(selectedExchange) => this.handleExchangeChange(item, selectedExchange)}
                  onAmountChange={(amount) => this.handleAmountChange(item, amount)}
                  onBuyPriceChange={(price) => this.handleBuyPriceChange(item, price)}
                  onSymbolChange={() => {}}
                  onClick={() => isUnlocked ? this.handleEdit(item) : undefined}
                />
              </div>
            )
          })}
        </Box>
      </div>
    )
  }
}