import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router-dom'
import { Box } from 'reflexbox'
import { roundPercentage, roundNumber } from '../../util/number-formatting'
import { TransactionModel } from '../../models'
import { Text } from '../../components'

export interface TransactionViewProps extends RouteComponentProps<{ groupId: string }> {
  settingsStore?: SettingsStore
  portfolioStore?: PortfolioStore
  modalStore?: ModalStore
}

function Label(props) {
  return (
    <Box mb={1}>
      <Text small light {...props} />
    </Box>
  )
}

@inject((store: RootStore) => ({
  settingsStore: store.settings,
  portfolioStore: store.portfolio,
  modalStore: store.modal,
}))
@observer
export default class TransactionView extends React.Component<TransactionViewProps, any> {
  private handleTransactionClick = (transaction: TransactionModel) => {
    const modalStore = this.props.modalStore!
    modalStore.showModal(modalStore.modalTypes.TRANSACTION, { id: transaction.id })
  }

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

    const avgBuyPrice = transactionGroup.averageBuyPrice == null ? 'N/A' : roundNumber(transactionGroup.averageBuyPrice)

    const avgSellPrice =
      transactionGroup.averageSellPrice == null ? 'N/A' : roundNumber(transactionGroup.averageSellPrice)
    const allTimeProfit = transactionGroup.totalProfit ? roundNumber(transactionGroup.totalProfit) : 'N/A'

    return (
      <div>
        <Text>Transactions</Text>
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
        {transactionGroup.transactions.map(transaction => {
          const isBuy = transaction.type === 'buy'
          const delta = transaction.deltaPercentage ? roundPercentage(transaction.deltaPercentage) : '-'
          const isPositive = (transaction.deltaPercentage || 0) >= 0
          const cost = roundNumber(transaction.getCalculatedTotalValue())

          return (
            <Box key={transaction.id} my={2} onClick={() => this.handleTransactionClick(transaction)}>
              <Box m={1}>
                <Text>
                  {isBuy ? 'Buy' : 'Sell'} {transaction.transactionDateFormatted} via {transaction.exchangeId}
                </Text>
              </Box>
              <Box
                p={1}
                style={{
                  backgroundColor: isBuy ? '#00ff001c' : '#ff00001a',
                  borderRadius: '6px',
                }}
              >
                <Box flex justify="space-between" mb={2}>
                  <Box>
                    <Label>
                      {transaction.symbolId} {isBuy ? 'Buy' : 'Sell'} Price
                    </Label>
                    <Text>{transaction.getCalculatedUnitPrice()}</Text>
                  </Box>
                  <Box>
                    <Label>Trading Pair</Label>
                    <Text>{transaction.tradingPair}</Text>
                  </Box>
                  <Box>
                    <Label>Amount {isBuy ? 'Bought' : 'Sold'}</Label>
                    <Text>{transaction.numberOfUnits}</Text>
                  </Box>
                </Box>
                <Box flex justify="space-between">
                  <Box>
                    <Label>{isBuy ? 'Cost' : 'Proceeds'}</Label>
                    <Text>{cost}</Text>
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
              </Box>
            </Box>
          )
        })}
      </div>
    )
  }
}
