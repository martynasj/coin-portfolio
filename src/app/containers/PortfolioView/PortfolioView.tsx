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
    const parsed = this.promtForInput()
    if (parsed) {
      this.props.portfolio.addItem(parsed.symbolId, parsed.buyPrice, parsed.numberOfUnits)
    }
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

  private handleLock = () => {
    const passcode = prompt('Enter pass code you want to use')
    if (passcode) {
      this.props.portfolio.lockPortfolio(passcode)
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
      return this.renderNotFound()
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
              <button onClick={() => this.handleEdit(item)}>Edit</button>
              <button onClick={() => this.handleDelete(item)}>Delete</button>
            </div>
          )
        })}
        <button onClick={this.handleAddNewCoin}>
          Add A Coin
        </button>
        <button onClick={this.handleLock}>
          Lock
        </button>
      </div>
    )
  }
}