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
    // this.props.ticker.fetchTicker('btc')
  }

  render() {
    const { portfolio, ticker } = this.props

    return (
      <div>
        <h1>My Shitcoin Portfolio</h1>
        <TotalsPanel
          worth={portfolio.totalWorth}
          change={portfolio.change}
          changePercentage={portfolio.changePercentage}
        />
        {portfolio.items.map(item =>
          <div key={item.id}>
            <PortfolioItem
              key={item.id}
              symbol={item.symbol}
              buyPrice={item.pricePerUnitPayed}
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
          </div>
        )}
        <button onClick={() => portfolio.addItem('btg', 0.24, 0.6)}>
          Add Item
        </button>
      </div>
    )
  }
}