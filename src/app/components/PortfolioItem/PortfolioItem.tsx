import * as React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { roundNumber, roundCurrency, roundPercentage } from '../../util/number-formatting'

interface OwnProps {
  key?: string
  symbol: string
  currentPrice: number
  buyPrice: number
  numberOfUnits: number
  changePercentage: number
  change: number
  totalBuyValue: number
  totalValue: number
  editable: boolean
}

interface Styles {
  root
}

type Props = OwnProps & FelaWithStylesProps<OwnProps, Styles>

const withStyles = connect<OwnProps, Styles>({
  root: {
    marginBottom: '12px',
  },
})

class PortfolioItem extends React.Component<Props, {}> {
  render() {
    const {
      symbol,
      currentPrice,
      buyPrice,
      numberOfUnits,
      change,
      changePercentage,
      styles,
      totalBuyValue,
      totalValue,
    } = this.props

    const color = buyPrice < currentPrice ? 'green' : 'red';

    return (
      <div className={styles.root}>
        <div>{symbol}</div>
        <div>Number of units: {numberOfUnits}</div>
        <div>Price paid for unit: {"$" + roundNumber(buyPrice)}</div>
        <div>Current price: {"$" + roundNumber(currentPrice)}</div>
        <div>Invested: {roundCurrency(totalBuyValue)}</div>
        <div>Worth: {roundCurrency(totalValue)}</div>
        <div>
          <span>Price change: </span>
          <span style={{ color: color }}>{roundCurrency(change)}</span>
        </div>
        <div>
          <span>Price change in percents: </span>
          <span style={{ color: color }}>{roundPercentage(changePercentage)}</span>
        </div>
      </div>
    )
  }
}

export default withStyles(PortfolioItem)