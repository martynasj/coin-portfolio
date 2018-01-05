import * as React from 'react'

interface Props {
  worth: number
  change: number
  changePercentage: number
}

export class TotalsPanel extends React.Component<Props> {
  render() {
    const { worth, change, changePercentage } = this.props

    return (
      <div>
        <h2>Worth: <span>{worth}</span></h2>
        <p>Change: <span>{change}</span></p>
        <p>Change Percentage: <span>{changePercentage}</span></p>
      </div>
    )
  }
}