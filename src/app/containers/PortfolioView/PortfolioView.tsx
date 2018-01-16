import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { RouteComponentProps, Route, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { PortfolioItemModel } from '../../models'
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

  private handleEdit = (item: PortfolioItemModel) => {
    this.props.history.push(`/p/${this.props.match.params.id}/item/${item.id}`)
  }

  private handleDelete = (item: PortfolioItemModel) => {
    item.delete()
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
      <div>
        <Route path={`${match.url}/add-item`} component={CreateNewItemView} />
        <Route path={`${match.url}/item/:id`} component={CreateNewItemView} />
        <Helmet>
          <title>
            {isUnlocked ? roundCurrency(portfolio.totalWorth || 0) : roundPercentage(portfolio.changePercentage)}
          </title>
        </Helmet>
        <h1>{portfolio.name}</h1>
        <TotalsPanel
          worth={portfolio.totalWorth}
          invested={portfolio.totalInitialWorth}
          change={portfolio.change}
          changePercentage={portfolio.changePercentage}
          locked={!isUnlocked}
        />
        <Toolbar />
        {isUnlocked &&
          <Link to={`/p/${match.params.id}/add-item`}>Add Coin</Link>
        }
        {portfolio.items.map(item => {
          return (
            <div key={item.id}>
              <PortfolioItem
                key={item.id}
                symbol={item.symbolId}
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
              {isUnlocked &&
                <div>
                  <button onClick={() => this.handleDelete(item)}>Delete</button>
                </div>
              }
            </div>
          )
        })}
      </div>
    )
  }
}