import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router-dom'
import { Box } from 'reflexbox'
import { roundPercentage, roundNumber } from '../../util/number-formatting'
import { Text } from '../../components'


export interface TransactionViewProps extends RouteComponentProps<{ groupId: string }> {
  settingsStore?: SettingsStore
  portfolioStore?: PortfolioStore
}

@inject((store: RootStore) => ({
  settingsStore: store.settings,
  portfolioStore: store.portfolio,
}))
@observer
export default class TransactionView extends React.Component<TransactionViewProps, any> {
  render() {
    const { match, portfolioStore } = this.props
    const { groupId } = match.params
    const transactionGroup = portfolioStore!.getTransactionGroup(groupId)
    
    if (!transactionGroup) {
      return (
        <div>
          <Text>This Transaction group does not exist</Text>
        </div>
      )
    }

    const avgBuyPrice = (transactionGroup.averageBuyPrice == null) 
      ? 'N/A' 
      : roundNumber(transactionGroup.averageBuyPrice)

    const avgSellPrice = (transactionGroup.averageSellPrice == null)
      ? 'N/A'
      : roundNumber(transactionGroup.averageSellPrice)

    return (
      <div>
        <Text>Transactions</Text>
        <Box flex p={1} justify="space-between">
          <Box>
            <Text>Avg Buy Price</Text>
            <Text>{avgBuyPrice}</Text>
          </Box>
          <Box>
            <Text>Avg Sell Price</Text>
            <Text>{avgSellPrice}</Text>
          </Box>
          <Box>
            <Text>Avg Delta</Text>
            <Text></Text>
          </Box>    
        </Box>
        {transactionGroup.transactions.map(transaction => { 
          const isBuy = transaction.type === 'buy'
          const delta = transaction.deltaPercentage ? roundPercentage(transaction.deltaPercentage) : '-'
          const isPositive = (transaction.deltaPercentage || 0) >= 0
          const cost = roundNumber(transaction.totalValue)

          return (
            <Box key={transaction.id} m={2}>
              <Box m={1}>
                <Text>
                  {isBuy ? 'Buy' : 'Sell'} {transaction.transactionDateFormatted} via {transaction.exchangeId}
                </Text>
              </Box>
              <Box 
                p={1}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e2e2',
                  borderRadius: '6px',
                }}
              >
                <Box flex justify="space-between" mb={1}>
                  <Box>
                    <Text>{transaction.symbolId} {isBuy ? 'Buy' : 'Sell'} Price</Text>
                    <Text>{transaction.unitPrice}</Text>
                  </Box>
                  <Box>
                    <Text>Trading Pair</Text>
                    <Text>{transaction.tradingPair}</Text>
                  </Box>
                  <Box>
                    <Text>Amount {isBuy ? 'Bought' : 'Sold'}</Text>
                    <Text>{transaction.numberOfUnits}</Text>
                  </Box>
                </Box>
                <Box flex justify="space-between">
                  <Box>
                    <Text>{isBuy ? 'Cost' : 'Proceeds'}</Text>
                    <Text>{cost}</Text>
                  </Box>             
                  {isBuy && 
                    <Box>
                      <Text>Worth</Text>
                      <Text>{transaction.currentTotalValue}</Text>
                    </Box>
                  }
                  {isBuy && 
                    <Box>
                      <Text>Delta</Text>
                      <Text 
                        success={isPositive}
                        error={!isPositive}
                      >
                      {delta}
                    </Text>
                    </Box>
                  }
                </Box>
              </Box>
            </Box>
          )
        })}
      </div>
    )
  }
}
