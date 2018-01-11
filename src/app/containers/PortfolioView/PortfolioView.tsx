import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { RouteComponentProps } from 'react-router'
import { Helmet } from 'react-helmet'
import { PortfolioItemModel } from '../../models'
import { PortfolioItem } from '../../components/PortfolioItem'
import { TotalsPanel } from '../../components/TotalsPanel'
import Toolbar from '../Toolbar'
import { roundCurrency, roundPercentage } from '../../util/number-formatting'

interface Props extends RootStore, RouteComponentProps<{ id: string }> {}

interface TempItem {
  symbol: string
  numberOfUnits: number
  buyPriceUsd: number
}

interface State {
  tempItem: TempItem|null
}

@inject((allStores: RootStore) => ({
  portfolio: allStores.portfolio,
  tickers: allStores.tickers,
}))
@observer
export class PortfolioView extends React.Component<Props, State> {

  state: State = {
    tempItem: null
  }

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

  private handleAddTempItem = () => {
    this.setState({
      tempItem: {
        symbol: '',
        buyPriceUsd: 0,
        numberOfUnits: 0,
      },
    })
  }

  private clearTempItem = () => {
    this.setState({ tempItem: null })
  }

  private handleTempItemPriceChange = (price: number) => {
    if (this.state.tempItem) {
      this.setState({
        tempItem: {
          ...this.state.tempItem,
          buyPriceUsd: price,
        },
      })
    }
  }

  private handleTempItemAmountChange = (amount: number) => {
    if (this.state.tempItem) {
      this.setState({
        tempItem: {
          ...this.state.tempItem,
          numberOfUnits: amount,
        },
      })
    }
  }

  private submitTempItem = () => {
    if (this.state.tempItem && this.isValidItem()) {
      const { symbol, buyPriceUsd, numberOfUnits } = this.state.tempItem
      this.props.portfolio.addItem(symbol, buyPriceUsd, numberOfUnits)
      this.setState({ tempItem: null })
    }
  }

  private handleTempItemSymbolChange = (symbol: string) => {
    this.state.tempItem!.symbol = symbol
    this.setState({ tempItem: this.state.tempItem })
  }

  private isValidItem = () => {
    return (this.state.tempItem && this.state.tempItem.symbol.length > 2)
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
    const { tempItem } = this.state

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
          <title>
            {isUnlocked ? roundCurrency(portfolio.totalWorth) : roundPercentage(portfolio.changePercentage)}
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
        <button onClick={this.handleAddTempItem}>Add Coin</button>
        {tempItem && (
          <PortfolioItem
            isTempItem
            locked={false}
            symbol={tempItem.symbol}
            buyPrice={tempItem.buyPriceUsd}
            numberOfUnits={tempItem.numberOfUnits}
            onAmountChange={this.handleTempItemAmountChange}
            onBuyPriceChange={this.handleTempItemPriceChange}
            onSubmit={this.submitTempItem}
            onCancel={this.clearTempItem}
            onSymbolChange={this.handleTempItemSymbolChange}
          />
        )}
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
                onSymbolChange={() => {}}
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