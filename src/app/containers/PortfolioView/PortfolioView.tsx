import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { PortfolioItem } from '../../components/PortfolioItem'
import { AllStores } from '../../stores'
import { PortfolioItemModel } from '../../models'

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
        <h1>Coint Portfolio</h1>
        {portfolio.items.map(item =>
          <PortfolioItem
            key={item.id}
            symbol={item.symbol}
            buyPrice={item.pricePerUnitPayed}
            currentPrice={item.currentPrice}
            numberOfUnits={item.numberOfUnits}
            change={123.56}
            changePercentage={10.1}
          />
        )}
        <button onClick={() => portfolio.addItem(new PortfolioItemModel('btg', 0.24, 0.6))}>
          Add Item
        </button>
      </div>
    )
  }
}