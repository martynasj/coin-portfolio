import * as React from 'react'

interface Props {
  worth: number
  invested: number
  change: number
  changePercentage: number
}

export class TotalsPanel extends React.Component<Props> {
  render() {
    const { worth, invested, change, changePercentage } = this.props

    const color = invested < worth ? 'green' : 'red';

    function roundCur(num) {
      return num.toLocaleString('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2})
    }

    function roundPer(num) {
      const value = Number(num) / 100;
      return value.toLocaleString('en-US', {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2});
    }

    return (
      <div>
        <h2>Worth: <span>{roundCur(worth)}</span></h2>
        <h2>Total invested: <span>{roundCur(invested)}</span></h2>
        <p>Change: <span style={{ color: color }}>{roundCur(change)}</span></p>
        <p>Change Percentage: <span style={{ color: color }}>{roundPer(changePercentage)}</span></p>
      </div>
    )
  }
}