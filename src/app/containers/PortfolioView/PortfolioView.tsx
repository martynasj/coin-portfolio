import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { RouteComponentProps } from 'react-router'
import { Helmet } from 'react-helmet'
import { PortfolioItemModel } from '../../models'
import { PortfolioItem } from '../../components/PortfolioItem'
import { TotalsPanel } from '../../components/TotalsPanel'
import Toolbar from '../Toolbar'
import { roundCurrency } from '../../util/number-formatting'

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
    this.props.portfolio.syncPortfolio(this.props.match.params.id)
  }

  private handleDelete = (item: PortfolioItemModel) => {
    item.delete()
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
    const { portfolio } = this.props
    const isUnlocked = portfolio.isUnlocked

    if (!portfolio.hasLoaded) {
      return this.renderLoading()
    }

    if (portfolio.portfolioNotFound) {
      return this.renderNotFound()
    }

    return (
      <div>
        <Helmet>
          <title>{roundCurrency(portfolio.totalWorth)}</title>
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
        {portfolio.items.map(item => {
          return (
            <div key={item.id}>
              <PortfolioItem
                key={item.id}
                symbol={item.symbolId}
                buyPrice={item.pricePerUnitPaid}
                currentPrice={item.currentPrice}
                numberOfUnits={item.numberOfUnits}
                change={item.change}
                changePercentage={item.changePercentage}
                totalBuyValue={item.totalBuyValue}
                totalValue={item.totalValue}
                locked={!isUnlocked}
                onAmountChange={(amount) => this.handleAmountChange(item, amount)}
                onBuyPriceChange={(price) => this.handleBuyPriceChange(item, price)}
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