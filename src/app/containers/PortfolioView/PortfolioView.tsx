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

  private handleAddNewCoin = () => {
    const input = window.prompt(
      `Type in the following separated by comas: coin symbol, number of units, buy price

       Example:
       xrp, 1200, 2.64
      `
    )
    if (input) {
      const tokens = input.toLowerCase().split(',').map(token => token.trim())
      if (tokens.length !== 3) {
        alert('Wrong input you dumb fuck')
        return
      }
      const symbolId = tokens[0]
      const numberOfUnits = parseFloat(tokens[1])
      const buyPrice = parseFloat(tokens[2])

      this.props.portfolio.addItem(symbolId, buyPrice, numberOfUnits)
    }
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
                symbol={item.symbolId}
                buyPrice={item.pricePerUnitPaid}
                currentPrice={item.currentPrice}
                numberOfUnits={item.numberOfUnits}
                change={item.change}
                changePercentage={item.changePercentage}
              />
            </div>
          )
        })}
        <button onClick={this.handleAddNewCoin}>
          Add A Coin
        </button>
      </div>
    )
  }
}