import * as React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'

interface OwnProps {
  key?: string
  symbol: string
  currentPrice: number
  buyPrice: number
  numberOfUnits: number
  changePercentage: number
  change: number
  totalBuyValue: number
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
    } = this.props

    const color = buyPrice < currentPrice ? 'green' : 'red';

    function roundNum(num) {
      return num.toPrecision(6);
    }

    function roundCur(num) {
      return num.toLocaleString('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2})
    }

    function roundPer(num) {
      const value = Number(num) / 100;
      return value.toLocaleString('en-US', {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
    
    return (
      <div className={styles.root}>
        <div>{symbol}</div>
        <div>Number of units: {numberOfUnits}</div>
        <div>Price paid for unit: {"$" + roundNum(buyPrice)}</div>
        <div>Current price: {"$" + roundNum(currentPrice)}</div>
        <div>Total invested: {"$" + roundNum(totalBuyValue)}</div>
        <div>
          <span>Price change: </span>
          <span style={{ color: color }}>{roundCur(change)}</span>
        </div>
        <div>
          <span>Price change in percents: </span>
          <span style={{ color: color }}>{roundPer(changePercentage)}</span>
        </div>
      </div>
    )
  }
}

export default withStyles(PortfolioItem)