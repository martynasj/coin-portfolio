import React from 'react'
import { Box } from 'reflexbox'
import { Text } from '../../components'
import { TransactionModel } from '../../models'
import NumberFormatter from '../../util/number-formatting'

export interface OwnProps {
  transaction: TransactionModel
}

function Label(props) {
  return (
    <Box mb={1}>
      <Text small light {...props} />
    </Box>
  )
}

export class TransactionItem extends React.Component<OwnProps, any> {
  render() {
    const { transaction } = this.props
    const isBuy = transaction.type === 'buy'
    const delta = transaction.deltaPercentage ? NumberFormatter.roundPercentage(transaction.deltaPercentage) : '-'
    const isPositive = (transaction.deltaPercentage || 0) >= 0
    const cost = transaction.getCalculatedTotalValue()
    const unitPrice = transaction.getCalculatedUnitPrice()

    return (
      <Box key={transaction.id} my={2} onClick={() => this.handleTransactionClick(transaction)}>
        <Box
          p={1}
          style={{
            backgroundColor: isBuy ? '#00ff001c' : '#ff00001a',
            borderRadius: '6px',
          }}
        >
          <Box flex justify="space-between" mb={2}>
            <Box>
              <Box style={{ backgroundColor: isBuy ? 'green' : 'red' }}>
                <Text inverted>{isBuy ? 'Buy' : 'Sell'}</Text>
              </Box>
              <Text bold large>
                {transaction.tradingPair}
              </Text>
            </Box>
            <Box>
              <Label>Unit Price</Label>
              <Text>{NumberFormatter.roundCurrency(unitPrice)}</Text>
            </Box>
            <Box>
              <Label>Amount {isBuy ? 'Bought' : 'Sold'}</Label>
              <Text>{transaction.numberOfUnits}</Text>
            </Box>
            <Box>
              <Label>{isBuy ? 'Cost' : 'Proceeds'}</Label>
              <Text>{NumberFormatter.roundCurrency(cost)}</Text>
            </Box>
            {isBuy && (
              <Box>
                <Label>Worth</Label>
                <Text>{transaction.currentTotalValue}</Text>
              </Box>
            )}
            {isBuy && (
              <Box>
                <Label>Delta</Label>
                <Text success={isPositive} error={!isPositive}>
                  {delta}
                </Text>
              </Box>
            )}
          </Box>
          <Box flex mt={2}>
            <Box mr={1}>
              <Text small light>
                {transaction.transactionDateFormatted}
              </Text>
            </Box>
            <Box>
              <Text small light>
                {transaction.exchangeId}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }
}
