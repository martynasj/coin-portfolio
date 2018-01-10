import * as React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { roundNumber, roundCurrency, roundPercentage } from '../../util/number-formatting'
import { theme } from '../../theme'

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
  locked: boolean
}

interface Styles {
  root
  symbol
}

type Props = OwnProps & FelaWithStylesProps<OwnProps, Styles>

const withStyles = connect<OwnProps, Styles>({
  root: {
    marginBottom: '12px',
    backgroundColor: theme.colors.neutral1,
    borderRadius: '8px',
    padding: '12px',
    border: `1px solid ${theme.colors.neutral2}`,
    boxShadow: '2px 3px 3px 0px #00000038',
    color: theme.colors.textLight,
  },
  symbol: {
    color: theme.colors.text,
    fontSize: '28px',
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
      locked,
    } = this.props

    const color = buyPrice < currentPrice ? theme.colors.green : theme.colors.red

    return (
      <div className={styles.root}>
        <div className={styles.symbol}>{symbol}</div>
        {!locked &&
          <div>
            <div>Number of units: {numberOfUnits}</div>
            <div>Invested: {roundCurrency(totalBuyValue)}</div>
            <div>Worth: {roundCurrency(totalValue)}</div>
            <div>
              <span>Profit: </span>
              <span style={{ color: color }}>{roundCurrency(change)}</span>
            </div>
          </div>
        }
        <div>Price paid for unit: {"$" + roundNumber(buyPrice)}</div>
        <div>Current price: {"$" + roundNumber(currentPrice)}</div>
        <div>
          <span>Profit: </span>
          <span style={{ color: color }}>{roundPercentage(changePercentage)}</span>
        </div>
      </div>
    )
  }
}

export default withStyles(PortfolioItem)