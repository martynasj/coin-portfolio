import * as React from 'react'
import { observer, inject } from 'mobx-react'
import * as stores from '../../constants/stores'
import { PortfolioStore } from '../../stores'
import { PortfolioItemModel } from '../../models'

interface Props {
  portfolio: PortfolioStore
}

@inject(stores.STORE_PORTFOLIO)
@observer
export class PortfolioView extends React.Component<Props> {
  render() {
    const { portfolio } = this.props

    return (
      <div>
        <h1>Coint Portfolio</h1>
        {portfolio.items.map(item =>
          <div key={item.symbol}>{item.symbol}</div>
        )}
        <button onClick={() => portfolio.addItem(new PortfolioItemModel('btg', 0.24))}>
          Add Item
        </button>
      </div>
    )
  }
}