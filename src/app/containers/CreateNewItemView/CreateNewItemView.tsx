import React from 'react'
import Autocomplete from 'react-autocomplete'
import { connect, FelaWithStylesProps } from 'react-fela'
import { observer, inject } from 'mobx-react'
import { Flex, Box } from 'reflexbox'
import { Button, Input } from '../../components'
import { theme } from '../../theme'
import { PairModel } from '../../models'
import { Modal, Text } from '../../components'

interface IState {
  transactionType: TransactionType
  symbolInput: string
  symbolId: string | null
  baseSymbolId: string | null
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
  exchangeSelector
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
  exchangeSelector: {
    backgroundColor: 'transparent',
    padding: '6px',
    borderBottom: `2px solid ${theme.colors.borderLight}`,
    color: theme.colors.textLight,
    outline: 'none',
    fontSize: '14px',
    cursor: 'pointer',
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
  constructor(props) {
    super(props)
    const item = this.getPortfolioItem()
    this.state = {
      transactionType: 'buy',
      symbolInput: '',
      symbolId: item ? item.symbolId : null,
      baseSymbolId: null, // todo: editing mode
      buyPriceUsd: item ? item.unitPrice : null,
      baseCurrencyPriceUsd: null, // todo: edit mode
      numberOfUnits: item ? item.numberOfUnits : null,
      exchangeId: item ? item.exchangeId : null,
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onClickListener)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onClickListener)
  }

  onClickListener = (event: any): void => {
    if (event.key === 'Enter') {
      this.submit()
    } else if (event.key === 'Escape') {
      this.close()
    }
  }

  private handleOverlayClick = () => {
    this.close()
  }

  private handleModalClick = (event: any) => {
    event.stopPropagation()
  }

  private handlePriceChange = (price: string) => {
    const priceFloat = parseFloat(price)
    if (priceFloat > 0) {
      this.setState({
        buyPriceUsd: priceFloat,
      })
    }
  }

  private handleBaseCurrencyPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const priceFloat = parseFloat(e.target.value)
    if (priceFloat > 0) {
      this.setState({
        baseCurrencyPriceUsd: priceFloat,
      })
    }
  }

  private handleAmountChange = (amount: string) => {
    const amountFloat = parseFloat(amount)
    if (amountFloat > 0) {
      this.setState({
        numberOfUnits: amountFloat,
      })
    }
  }

  private handlePairInputChange = (_event, inputValue: string) => {
    this.setState({ symbolInput: inputValue })
  }

  private handlePairSelect = (value: string, item: PairModel) => {
    this.setState({
      symbolId: item.symbolId,
      baseSymbolId: item.baseSymbolId,
      symbolInput: value,
    })
  }

  private handleTransactionTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ transactionType: event.target.value as TransactionType })
  }

  private handleExchangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    this.setState({
      exchangeId: value,
      symbolId: null,
      baseSymbolId: null,
      symbolInput: '',
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
    const item = this.getPortfolioItem()
    this.close()
    if (item) {
      item.delete()
    }
  }

  private isValidItem = () => {
    return (
      this.state.symbolId &&
      this.state.symbolId.length > 1 &&
      this.state.buyPriceUsd &&
      this.state.numberOfUnits &&
      this.state.baseCurrencyPriceUsd
    )
  }

  private submit = () => {
    if (this.isValidItem()) {
      const item = this.getPortfolioItem()
      if (item) {
        this.updateItem()
      } else {
        this.createNewItem()
      }
      this.close()
    }
  }

  // todo: implement
  private updateItem = () => {
    const { buyPriceUsd, numberOfUnits, exchangeId } = this.state
    const item = this.getPortfolioItem()!
    item.exchangeId = exchangeId!
    item.unitPrice = buyPriceUsd!
    item.numberOfUnits = numberOfUnits!
  }

  private createNewItem = () => {
    const { symbolId, buyPriceUsd, numberOfUnits, exchangeId } = this.state
    this.props.portfolioStore!.addTransaction({
      symbolId: symbolId!,
      unitPrice: buyPriceUsd!,
      numberOfUnits: numberOfUnits!,
      exchangeId: exchangeId!,
      transactionDate: new Date(),
      type: 'buy', // todo
      baseSymbolId: this.state.baseSymbolId!,
      baseSymbolPriceUsd: this.state.baseCurrencyPriceUsd!,
    })
  }

  private close() {
    this.props.modalStore!.closeModal()
  }

  private getPortfolioItem = () => {
    return this.props.portfolioStore!.getTransaction(this.props.id)
  }

  private shouldSymbolSuggestionRender = (item: PairModel, inputValue: string | null): boolean => {
    if (!this.state.exchangeId) {
      return false
    }
    if (inputValue) {
      const valueLowerCase = inputValue.toLowerCase()
      return item
        .getPairString()
        .toLowerCase()
        .includes(valueLowerCase)
    } else {
      return true
    }
  }

  private renderSymbolInput = ({ ref, ...rest }) => (
    <Input
      {...rest}
      innerRef={ref}
      disabled={!!this.getPortfolioItem() || !this.state.exchangeId}
      placeholder={'e.g. eth'}
    />
  )

  private renderSymbolSuggestion = (item: PairModel, isHighlighted: boolean) => (
    <div key={item.getPairString()} style={{ background: isHighlighted ? theme.colors.textLight : 'none' }}>
      <Text>{item.getPairString()}</Text>
    </div>
  )

  public render() {
    const { numberOfUnits, symbolInput, buyPriceUsd, exchangeId, transactionType } = this.state
    const { styles, tickerStore } = this.props

    const supportedExchanges = tickerStore!.getSupportedExchangeIds()
    const pairs = exchangeId ? tickerStore!.getPairs(exchangeId) : []
    const isNewItem = !this.getPortfolioItem()

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
              <select
                className={styles.exchangeSelector}
                value={exchangeId || 'default'}
                onChange={this.handleExchangeChange}
              >
                <option disabled value={'default'}>
                  Select One
                </option>
                {supportedExchanges.map(item => (
                  <option key={item} value={item}>
                    {item.toUpperCase()}
                  </option>
                ))}
              </select>
            </Box>
            <Text large className={styles.label}>
              Currency
            </Text>
            <Autocomplete
              value={symbolInput}
              items={pairs}
              selectOnBlur={true}
              shouldItemRender={this.shouldSymbolSuggestionRender}
              onChange={this.handlePairInputChange}
              onSelect={this.handlePairSelect}
              getItemValue={(item: PairModel) => item.getPairString()}
              renderItem={this.renderSymbolSuggestion}
              renderInput={this.renderSymbolInput}
              menuStyle={{
                background: theme.colors.borderLight,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                padding: '2px 0',
                fontSize: '90%',
                position: 'fixed',
                overflow: 'auto',
                maxHeight: '50%', // is pixel value better?
                zIndex: '1',
              }}
            />
          </Box>
          <Box mb={1}>
            <Text large className={styles.label}>
              Buy amount
            </Text>
            <Input
              blurOnInput
              type={'number'}
              onChange={e => this.handleAmountChange(e.target.value)}
              defaultValue={numberOfUnits ? numberOfUnits.toString() : '0'}
            />
          </Box>
          <Box mb={1}>
            <Text large className={styles.label}>
              Buy Price
            </Text>
            <Input
              blurOnInput
              type={'number'}
              onChange={e => this.handlePriceChange(e.target.value)}
              defaultValue={buyPriceUsd ? buyPriceUsd.toString() : '0'}
            />
          </Box>
          <Box mb={1}>
            <Text large className={styles.label}>
              Base Currency Price
            </Text>
            <Input
              blurOnInput
              onChange={this.handleBaseCurrencyPriceChange}
              defaultValue={buyPriceUsd ? buyPriceUsd.toString() : '0'}
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
