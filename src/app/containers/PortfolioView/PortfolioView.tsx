import _ from 'lodash'
import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { RouteComponentProps } from 'react-router'
import { PortfolioItemModel } from '../../models'
import { PortfolioItem } from '../../components/PortfolioItem'
import { TotalsPanel } from '../../components/TotalsPanel'

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

  renderLoading = () => {
    return (
      <div>Loading</div>
    )
  }

  renderNotFound = () => {
    return (
      <div>
        <p>This shitcoin bag does not exists</p>
        <p>Go ahead. Take that slug</p>
      </div>
    )
  }

  render() {
    const { portfolio, tickers, match } = this.props

    if (!portfolio.hasLoaded) {
      return this.renderLoading()
    }

    if (portfolio.portfolioNotFound) {
      return this.renderLoading()
    }

    console.log(portfolio.items)
    return (
      <div>
        <h1>{portfolio.name}</h1>
        <TotalsPanel
          worth={portfolio.totalWorth}
          change={portfolio.change}
          changePercentage={portfolio.changePercentage}
        />
        {portfolio.items.map(item => {
          return (
          <div key={item.id}>
            <PortfolioItem
              key={item.id}
              symbol={item.symbol}
              buyPrice={item.pricePerUnitPaid}
              currentPrice={item.currentPrice}
              numberOfUnits={item.numberOfUnits}
              change={item.change}
              changePercentage={item.changePercentage}
            />
            <button onClick={() => {
              item.setNumberOfUnits(item.numberOfUnits + 1)
            }}>
              Add 1 unit
            </button>
          </div>)
        })}
      </div>
    )
  }
}