import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { RouteComponentProps, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Flex } from 'reflexbox'
import { PortfolioItemModel } from '../../models'
import { Button } from '../../components'
import { PortfolioItem } from '../../components/PortfolioItem'
import { TotalsPanel } from '../../components/TotalsPanel'
import CreateNewItemView from '../CreateNewItemView'
import Toolbar from '../Toolbar'
import { roundCurrency, roundPercentage } from '../../util/number-formatting'

interface Props extends RootStore, RouteComponentProps<{ id: string }> {}

@inject((allStores: RootStore) => ({
  portfolio: allStores.portfolio,
  tickers: allStores.tickers,
}))
@observer
export class PortfolioView extends React.Component<Props> {

  componentWillMount() {
    this.initTickers()
  }

  private initTickers = () => {
    this.props.tickers.getAllTIckers()
    this.props.tickers.syncTicker('btc')
    this.props.tickers.syncTicker('eth')
    this.props.portfolio.syncPortfolio(this.props.match.params.id)
  }

  private handleAddItemClick = () => {
    this.props.history.push(`/p/${this.props.match.params.id}/add-item`)
  }

  private handleEdit = (item: PortfolioItemModel) => {
    this.props.history.push(`/p/${this.props.match.params.id}/item/${item.id}`)
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
        <p>This shitcoin bag does not exist</p>
        <p>Go ahead. Take that slug</p>
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
      <div
        style={{
          width: '80%',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Route path={`${match.url}/add-item`} component={CreateNewItemView} />
        <Route path={`${match.url}/item/:id`} component={CreateNewItemView} />
        <Helmet>
          <title>
            {isUnlocked ? roundCurrency(portfolio.totalWorth || 0) : roundPercentage(portfolio.changePercentage)}
          </title>
        </Helmet>
        <Flex>
          <h1>{portfolio.name}</h1>
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
          <Button
            onClick={this.handleAddItemClick}
            style={{ marginBottom: '15px' }}>
            Add Coin
          </Button>
        }
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
                totalValue={item.totalValue}
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
      </div>
    )
  }
}