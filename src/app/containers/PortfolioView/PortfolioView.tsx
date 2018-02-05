import * as React from 'react'
import {observer, inject} from 'mobx-react'
import {Route, withRouter, RouteComponentProps} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import {Box, Flex} from 'reflexbox'
import {PortfolioItemModel} from '../../models'
import {Button, Text} from '../../components'
import {PortfolioItem} from '../../components/PortfolioItem'
import {TotalsPanel} from '../../components/TotalsPanel'
import CreateNewItemView from '../CreateNewItemView'
import Toolbar from '../Toolbar'
import {roundCurrency} from '../../util/number-formatting'
import {theme} from '../../theme'

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

  private handleEdit = (item: PortfolioItemModel) => {
    // todo: abstract this
    this.props.history.push(`${this.props.location.pathname}/item/${item.id}`)
  }

  private handleExchangeChange = (item: PortfolioItemModel, selectedExchangeId: string | null) => {
    item.exchangeId = selectedExchangeId
  }

  private handleAmountChange = (item: PortfolioItemModel, amount: number) => {
    item.numberOfUnits = amount
  }

  private handleBuyPriceChange = (item: PortfolioItemModel, price: number) => {
    item.pricePerUnitPaid = price
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
    const {portfolio, tickers} = this.props

    if (!portfolio!.hasLoaded) {
      return this.renderLoading()
    }

    if (portfolio!.portfolioNotFound) {
      return this.renderNotFound()
    }

    return (
      <div style={{backgroundColor: theme.colors.backgroundLight, minHeight: '100vh'}}>
        <Route path={`/dashboard/:portfolioId/add-item`} component={CreateNewItemView} />
        <Route path={`/dashboard/:portfolioId/item/:id`} component={CreateNewItemView} />
        <Helmet>
          <title>{roundCurrency(portfolio!.totalWorth || 0)}</title>
        </Helmet>

        <Box mb={2} style={{backgroundColor: theme.colors.white}}>
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
          <Flex
            justify="flex-end"
            style={{
              margin: '10px 15px',
              paddingLeft: '35px',
              paddingRight: '35px',
            }}
          >
            <Toolbar />
          </Flex>
          {portfolio!.items.map(item => {
            return (
              <div key={item.id}>
                <PortfolioItem
                  key={item.id}
                  symbol={item.symbolId}
                  name={item.getTickerFullName()}
                  selectedExchange={item.exchangeId}
                  supportedExchanges={tickers!.getSupportedExchangeIds(item.symbolId)}
                  buyPrice={item.pricePerUnitPaid}
                  currentPrice={item.currentPriceUSD}
                  numberOfUnits={item.numberOfUnits}
                  change={item.change}
                  changePercentage={item.changePercentage}
                  totalBuyValue={item.totalBuyValue}
                  totalValue={item.currentTotalValue}
                  onExchangeChange={selectedExchange => this.handleExchangeChange(item, selectedExchange)}
                  onAmountChange={amount => this.handleAmountChange(item, amount)}
                  onBuyPriceChange={price => this.handleBuyPriceChange(item, price)}
                  onSymbolChange={() => {}}
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

export default withRouter<OwnProps>(PortfolioView)
