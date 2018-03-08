import _ from 'lodash'
import React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { observer, inject } from 'mobx-react'
import { Flex, Box } from 'reflexbox'
import { Button, Select, PairSelect, NumberInput } from '../../components'
import { theme } from '../../theme'
import { PairModel } from '../../models'
import { Modal, Text } from '../../components'

interface IState {
  transactionType: TransactionType
  selectedPair: PairModel | null
  buyPriceUsd: number | null
  baseCurrencyPriceUsd: number | null
  numberOfUnits: number | null
  exchangeId: string | null
}

export interface OwnProps {
  id: string
}

export interface InjectProps {
  portfolioStore?: PortfolioStore
  tickerStore?: TickerStore
  modalStore?: ModalStore
}

interface IStyles {
  overlay
  label
}

type Props = InjectProps & OwnProps & FelaWithStylesProps<InjectProps, IStyles>

const withStyles = connect<InjectProps & OwnProps, IStyles>({
  overlay: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  label: {
    padding: '16px 0',
  },
})

@observer
@inject((rootStore: RootStore) => ({
  portfolioStore: rootStore.portfolio,
  tickerStore: rootStore.tickers,
  modalStore: rootStore.modal,
}))
class CreateNewItemView extends React.Component<Props, IState> {
  constructor(props: Props) {
    super(props)
    const item = this.getTransaction()
    const firstExchangeId = _.first(props.tickerStore!.getSupportedExchangeIds()) || null
    this.state = {
      selectedPair: item ? item.pairModel : null,
      transactionType: item ? item.type : 'buy',
      buyPriceUsd: item ? item.unitPrice : null,
      baseCurrencyPriceUsd: item ? item.baseSymbolPriceUsd : null,
      numberOfUnits: item ? item.numberOfUnits : null,
      exchangeId: item ? item.exchangeId : firstExchangeId,
    }
  }

  private handleOverlayClick = () => {
    this.close()
  }

  private handleModalClick = (event: any) => {
    event.stopPropagation()
  }

  private handlePriceChange = (newPrice: number) => {
    this.setState({
      buyPriceUsd: newPrice,
    })
  }

  private handleBaseCurrencyPriceChange = (newBasePrice: number) => {
    this.setState({
      baseCurrencyPriceUsd: newBasePrice,
    })
  }

  private handleAmountChange = (newAmount: number) => {
    console.log(newAmount)
    this.setState({
      numberOfUnits: newAmount,
    })
  }

  private handlePairSelect = (selectedPair: PairModel) => {
    this.setState({ selectedPair })
  }

  private handleTransactionTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ transactionType: event.target.value as TransactionType })
  }

  private handleExchangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    this.setState({
      exchangeId: value,
      selectedPair: null,
    })
  }

  private handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    this.submit()
  }

  private handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    this.close()
  }

  private handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const item = this.getTransaction()
    this.close()
    if (item) {
      item.delete()
    }
  }

  private isValidItem = () => {
    return (
      this.state.selectedPair &&
      _.isNumber(this.state.buyPriceUsd) &&
      _.isNumber(this.state.numberOfUnits) &&
      _.isNumber(this.state.baseCurrencyPriceUsd)
    )
  }

  private submit = () => {
    if (this.isValidItem()) {
      const item = this.getTransaction()
      if (item) {
        this.updateItem()
      } else {
        this.createNewItem()
      }
      this.close()
    }
  }

  private updateItem = () => {
    const { buyPriceUsd, numberOfUnits, exchangeId, baseCurrencyPriceUsd } = this.state
    const item = this.getTransaction()!
    item.exchangeId = exchangeId!
    item.unitPrice = buyPriceUsd!
    item.numberOfUnits = numberOfUnits!
    item.baseSymbolPriceUsd = baseCurrencyPriceUsd!
  }

  private createNewItem = () => {
    const { selectedPair, buyPriceUsd, numberOfUnits, exchangeId, transactionType } = this.state
    this.props.portfolioStore!.addTransaction({
      symbolId: selectedPair!.symbolId,
      unitPrice: buyPriceUsd!,
      numberOfUnits: numberOfUnits!,
      exchangeId: exchangeId!,
      transactionDate: new Date(),
      type: transactionType,
      baseSymbolId: selectedPair!.baseSymbolId,
      baseSymbolPriceUsd: this.state.baseCurrencyPriceUsd!,
    })
  }

  private close() {
    this.props.modalStore!.closeModal()
  }

  private getTransaction = () => {
    return this.props.portfolioStore!.getTransaction(this.props.id)
  }

  public render() {
    const { numberOfUnits, selectedPair, buyPriceUsd, baseCurrencyPriceUsd, exchangeId, transactionType } = this.state
    const { styles, tickerStore } = this.props

    const supportedExchanges = tickerStore!.getSupportedExchangeIds()
    const pairs = exchangeId ? tickerStore!.getPairs(exchangeId) : []
    const isNewItem = !this.getTransaction()
    const baseCurrencySymbol = selectedPair ? selectedPair.baseSymbolId : 'Base'

    return (
      <Modal
        title={isNewItem ? 'Add new Coin' : 'Edit Coin'}
        onClick={this.handleModalClick}
        onOverlayClick={this.handleOverlayClick}
      >
        <Box>
          <Box>
            <Box mb={1}>
              <select value={transactionType} onChange={this.handleTransactionTypeChange}>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </Box>
            <Box mb={1}>
              <Text large className={styles.label}>
                Exchange
              </Text>
              <Select
                value={exchangeId || 'default'}
                onChange={this.handleExchangeChange}
                options={supportedExchanges.map(item => ({ text: item, value: item }))}
              />
            </Box>
            <Text large className={styles.label}>
              Currency
            </Text>
            <PairSelect
              fluid
              disabled={!this.state.exchangeId}
              value={this.state.selectedPair}
              pairs={pairs}
              onChange={this.handlePairSelect}
            />
          </Box>
          <Box mb={1}>
            <Text large className={styles.label}>
              Buy amount
            </Text>
            <NumberInput fluid onChange={this.handleAmountChange} value={numberOfUnits} />
          </Box>
          <Box mb={1}>
            <Text large className={styles.label}>
              Buy Price
            </Text>
            <NumberInput fluid placeholder={'Price of 1 unit'} onChange={this.handlePriceChange} value={buyPriceUsd} />
          </Box>
          <Box mb={1}>
            <Text large className={styles.label}>
              {baseCurrencySymbol} Currency Price
            </Text>
            <NumberInput
              fluid
              placeholder={`Price of ${baseCurrencySymbol} at the time of buy`}
              onChange={this.handleBaseCurrencyPriceChange}
              value={baseCurrencyPriceUsd}
            />
          </Box>
          <Flex justify="center" mt={3}>
            <Box mx={1}>
              <Button disabled={!this.isValidItem()} onClick={this.handleSubmit}>
                {isNewItem ? 'OK' : 'Save'}
              </Button>
            </Box>
            <Box mx={1}>
              <Button onClick={this.handleCancel}>Cancel</Button>
            </Box>
            {!isNewItem && (
              <Box mx={1}>
                <Button style={{ backgroundColor: theme.colors.red }} onClick={this.handleDelete}>
                  Remove
                </Button>
              </Box>
            )}
          </Flex>
        </Box>
      </Modal>
    )
  }
}

export default withStyles(CreateNewItemView)
