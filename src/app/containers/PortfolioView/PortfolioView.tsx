import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { PortfolioItemModel } from '../../models'
import { PortfolioItem } from '../../components/PortfolioItem'
import { TotalsPanel } from '../../components/TotalsPanel'

interface Props extends RootStore {}

@inject((allStores: RootStore) => ({
  portfolio: allStores.portfolio,
  ticker: allStores.ticker,
}))
@observer
export class PortfolioView extends React.Component<Props> {
  componentWillMount() {
    this.initTickers()
  }

  private initTickers = () => {
    this.props.ticker.fetchTicker('fds')
  }

  render() {
    console.log('render')
    const { portfolio, ticker } = this.props
    console.log(ticker.tickers)

    return (
      <div>
        <h1>My Shitcoin Portfolio</h1>
        <TotalsPanel
          worth={portfolio.totalWorth}
          change={portfolio.change}
          changePercentage={portfolio.changePercentage}
        />
        {portfolio.items.map(item =>
          <PortfolioItem
            key={item.id}
            symbol={item.symbol}
            buyPrice={item.pricePerUnitPayed}
            currentPrice={item.currentPrice}
            numberOfUnits={item.numberOfUnits}
            change={item.change}
            changePercentage={item.changePercentage}
          />
        )}
        <button onClick={() => portfolio.addItem(new PortfolioItemModel('btg', 0.24, 0.6))}>
          Add Item
        </button>
      </div>
    )
  }
}