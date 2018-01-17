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
  exchangeId: string|null
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
    this.props.tickers.getAllTIckers()
    this.props.tickers.syncTicker('btc')
    this.props.tickers.syncTicker('eth')
    this.props.portfolio.syncPortfolio(this.props.match.params.id)
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

  private handleAddTempItem = () => {
    this.setState({
      tempItem: {
        symbol: '',
        buyPriceUsd: 0,
        numberOfUnits: 0,
        exchangeId: null,
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
      const { symbol, buyPriceUsd, numberOfUnits, exchangeId } = this.state.tempItem
      this.props.portfolio.addItem(symbol, buyPriceUsd, numberOfUnits, exchangeId)
      this.setState({ tempItem: null })
    }
  }

  private handleTempItemSymbolChange = (symbol: string) => {
    this.state.tempItem!.symbol = symbol
    this.setState({ tempItem: this.state.tempItem })
  }

  private handleTempItemExchangeChange = (selectedExchangeId: string|null) => {
    if (this.state.tempItem) {
      this.setState({
        tempItem: {
          ...this.state.tempItem,
          exchangeId: selectedExchangeId,
        },
      })
    }
  }

  private isValidItem = () => {
    return (this.state.tempItem && this.state.tempItem.symbol.length > 1)
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
    const { portfolio, tickers } = this.props
    const { tempItem } = this.state

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
          width: '65%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
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
        <button onClick={this.handleAddTempItem}>Add Coin</button>
        {tempItem && (
          <PortfolioItem
            isTempItem
            locked={false}
            symbol={tempItem.symbol}
            supportedExchanges={tickers.getSupportedExchanges(tempItem.symbol)}
            buyPrice={tempItem.buyPriceUsd}
            selectedExchange={tempItem.exchangeId}
            numberOfUnits={tempItem.numberOfUnits}
            onExchangeChange={this.handleTempItemExchangeChange}
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