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
    } = this.props

    const color = buyPrice < currentPrice ? 'green' : 'red'

    return (
      <div className={styles.root}>
        <div>{symbol}</div>
        <div>Number of units: {numberOfUnits}</div>
        <div>Price paid for unit: {buyPrice}</div>
        <div>Current price: {currentPrice}</div>
        <div>Price change: {change}</div>
        <div style={{ color: color }}>Price change in percents: {changePercentage}</div>
      </div>
    )
  }
}

export default withStyles(PortfolioItem)