import * as React from 'react'
import { roundCurrency } from '../../util/number-formatting'
import { roundPercent } from '../../util/number-formatting'

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

    return (
      <div>
        <h2>Total worth: <span>{roundCurrency(worth)}</span></h2>
        <h2>Total invested: <span>{roundCurrency(invested)}</span></h2>
        <p>Change: <span style={{ color: color }}>{roundCurrency(change)}</span></p>
        <p>Change Percentage: <span style={{ color: color }}>{roundPercent(changePercentage)}</span></p>
      </div>
    )
  }
}