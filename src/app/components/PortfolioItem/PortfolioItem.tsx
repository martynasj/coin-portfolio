import * as React from 'react'

interface Props {
  key?: string
  symbol: string
  currentPrice: number
  buyPrice: number
  numberOfUnits: number
  changePercentage: number
  change: number
}

export class PortfolioItem extends React.Component<Props, {}> {
  render() {
    const {
      symbol,
      currentPrice,
      buyPrice,
      numberOfUnits,
      change,
      changePercentage,
    } = this.props

    const color = buyPrice < currentPrice ? 'green' : 'red'

    return (
      <div style={{ marginBottom: 12 }}>
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