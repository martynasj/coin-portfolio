import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { RouteComponentProps } from 'react-router'
import { TransactionGroupModel } from '../../models'
import { PortfolioItem } from '../../components/PortfolioItem'

interface IProps extends InjectProps, RouteComponentProps<{}> {}

interface InjectProps {
  portfolio?: PortfolioStore
}

@inject((store: RootStore) => ({
  portfolio: store.portfolio,
}))
@observer
export default class PortfolioItemsList extends React.Component<IProps, any> {
  private handleItemClick = (item: TransactionGroupModel) => {
    // todo: abstract this
    this.props.history.push(`${this.props.location.pathname}/item/${item.id}`)
  }

  private get portfolioStore() {
    return this.props.portfolio!
  }

  render() {
    return (
      <div>
        {this.portfolioStore.getTransactionGroups().map(item => {
          return (
            <div key={item.id}>
              <PortfolioItem
                symbol={item.symbolId}
                iconUrl={item.getThumbIconUrl()}
                name={item.getTickerFullName()}
                buyPrice={item.averageBuyPrice || 0}
                currentPrice={item.currentUnitPrice}
                numberOfUnits={item.totalUnitsHold}
                profit={item.totalProfit}
                changePercentage={item.getTotalProfitDelta()}
                marketValue={item.currentTotalHoldValue}
                onClick={() => this.handleItemClick(item)}
                holdingStake={this.portfolioStore.getStake(item)}
              />
            </div>
          )
        })}
      </div>
    )
  }
}
