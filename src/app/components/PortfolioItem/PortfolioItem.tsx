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

    return (
      <div style={{ marginBottom: 12 }}>
        <div>{symbol}</div>
        <div>{numberOfUnits}</div>
        <div>{buyPrice}</div>
        <div>{currentPrice}</div>
        <div>{change}</div>
        <div>{changePercentage}</div>
      </div>
    )
  }
}