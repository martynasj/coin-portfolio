import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router-dom'
import { Box } from 'reflexbox'
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

    return (
      <div>
        <Text>Transactions</Text>
        {transactionGroup.transactions.map(transaction => (
          <Box m={2}>
            <Box m={1}>
              <Text>Buy/Sell date via {transaction.exchangeId}</Text>
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
                  <Text>{transaction.symbolId} Buy/Sell Price</Text>

                </Box>
                <Box>
                  <Text>Trading Pair</Text>
                </Box>
                <Box>
                  <Text>Amount Sold/Bought</Text>
                </Box>
              </Box>
              <Box flex justify="space-between">
                <Box>
                  <Text>Cost</Text>
                </Box>
                <Box>
                  <Text>Worth</Text>
                </Box>
                <Box>
                  <Text>Delta</Text>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </div>
    )
  }
}
