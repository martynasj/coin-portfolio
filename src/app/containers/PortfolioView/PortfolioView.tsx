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

  private promtForInput = (prefilledInput?: string): any|null => {
    const input = window.prompt(
      `Type in the following separated by comas: coin symbol, number of units, buy price

       Example:
       xrp, 1200, 2.64
      `
    , prefilledInput)
    if (input) {
      return this.parseUserInput(input)
    } else {
      return null
    }
  }

  private parseUserInput = (input: string) => {
    const tokens = input.toLowerCase().split(',').map(token => token.trim())
    if (tokens.length !== 3) {
      alert('Wrong input you dumb fuck')
      return null
    }
    return {
      symbolId: tokens[0],
      numberOfUnits: parseFloat(tokens[1]),
      buyPrice: parseFloat(tokens[2]),
    }
  }

  private handleDelete = (item: PortfolioItemModel) => {
    item.delete()
  }

  private handleEdit = (item: PortfolioItemModel) => {
    const prefilled = [item.symbolId, item.numberOfUnits, item.pricePerUnitPaid].join(', ')
    const parsed = this.promtForInput(prefilled)
    if (parsed) {
      item.pricePerUnitPaid = parsed.buyPrice
      item.numberOfUnits = parsed.numberOfUnits
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
              />
              {isUnlocked &&
                <div>
                  <button onClick={() => this.handleEdit(item)}>Edit</button>
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