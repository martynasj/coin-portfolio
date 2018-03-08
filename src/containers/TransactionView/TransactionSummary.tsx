import React from 'react'
import { Box } from 'reflexbox'
import { TransactionGroupModel } from '../../models'
import { Text } from '../../components'
import NumberFormatter from '../../util/number-formatting'

export interface OwnProps {
  transactionGroup: TransactionGroupModel
}

function Label(props) {
  return (
    <Box mb={1}>
      <Text small light {...props} />
    </Box>
  )
}

export class TransactionSummary extends React.Component<OwnProps, any> {
  render() {
    const { transactionGroup } = this.props

    const avgBuyPrice =
      transactionGroup.averageBuyPrice == null ? 'N/A' : NumberFormatter.roundNumber(transactionGroup.averageBuyPrice)

    const avgSellPrice =
      transactionGroup.averageSellPrice == null ? 'N/A' : NumberFormatter.roundNumber(transactionGroup.averageSellPrice)
    const allTimeProfit = transactionGroup.totalProfit
      ? NumberFormatter.roundNumber(transactionGroup.totalProfit)
      : 'N/A'

    return (
      <Box>
        <Box>
          <Text xl bold>
            {transactionGroup.getTickerFullName()}
          </Text>
        </Box>
        <Box>
          <Label>All Time Profit</Label>
          <Text>{allTimeProfit}</Text>
        </Box>
        <Box flex justify="space-around">
          <Box>
            <Label>Units Hold</Label>
            <Text>{transactionGroup.totalUnitsHold}</Text>
          </Box>
          <Box>
            <Label>Market Value</Label>
            <Text>{transactionGroup.currentTotalHoldValue}</Text>
          </Box>
          <Box>
            <Label>Net Cost</Label>
            <Text>{transactionGroup.netCost}</Text>
          </Box>
        </Box>
        <Box flex p={1} justify="space-between">
          <Box>
            <Label>Avg Buy Price</Label>
            <Text>{avgBuyPrice}</Text>
          </Box>
          <Box>
            <Label>Avg Sell Price</Label>
            <Text>{avgSellPrice}</Text>
          </Box>
          <Box>
            <Label>Avg Delta</Label>
            <Text />
          </Box>
        </Box>
      </Box>
    )
  }
}
