import React from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router-dom'
import { Text } from '../../components'
import { TransactionSummary } from './TransactionSummary'
import { TransactionItem } from './TransactionItem'

export interface TransactionViewProps extends RouteComponentProps<{ groupId: string }> {
  settingsStore?: SettingsStore
  portfolioStore?: PortfolioStore
  modalStore?: ModalStore
}

@inject((store: RootStore) => ({
  settingsStore: store.settings,
  portfolioStore: store.portfolio,
  modalStore: store.modal,
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
        <TransactionSummary transactionGroup={transactionGroup} />
        <Text large bold>
          Transactions
        </Text>
        {transactionGroup.transactions.map(transaction => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    )
  }
}
