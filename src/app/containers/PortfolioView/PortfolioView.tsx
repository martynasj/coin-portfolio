import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { AllStores } from '../../stores'
import { PortfolioItemModel } from '../../models'
import { PortfolioItem } from '../../components/PortfolioItem'
import { TotalsPanel } from '../../components/TotalsPanel'

interface Props extends AllStores {}

@inject((allStores: AllStores) => ({
  portfolio: allStores.portfolio
}))
@observer
export class PortfolioView extends React.Component<Props> {
  render() {
    const { portfolio } = this.props

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