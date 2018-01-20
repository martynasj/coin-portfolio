import React from 'react'
import Autocomplete from 'react-autocomplete'
import { RouteComponentProps } from 'react-router-dom'
import { connect, FelaWithStylesProps } from 'react-fela'
import { observer, inject } from 'mobx-react'
import { Flex, Box } from 'reflexbox'
import { Button, Input } from '../../components'
import { theme } from '../../theme'
import TickerModel from '../../models/TickerModel';

interface IState {
  symbol: string
  buyPriceUsd: number|null
  numberOfUnits: number|null
  exchangeId: string|null,
}

export interface IProps extends RouteComponentProps<{ id: string }> {
  portfolioStore?: PortfolioStore
  tickerStore?: TickerStore
}

interface IStyles {
  root
  overlay
  exchangeSelector
}

type Props = IProps & FelaWithStylesProps<IProps, IStyles>

const withStyles = connect<IProps, IStyles>({
  root: {
    maxWidth: '400px',
    padding: '16px',
    margin: '10% auto',
    backgroundColor: theme.colors.neutral,
    borderRadius: '8px',
    boxShadow: '2px 3px 3px 0px #00000038',
  },
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
    border: '2px solid',
    borderColor: theme.colors.neutral1,
    borderRadius: '4px',
    color: theme.colors.text,
    outline: 'none',
    fontSize: '14px',
    cursor: 'pointer',
  }
})

@observer
@inject((rootStore: RootStore) => ({
  portfolioStore: rootStore.portfolio,
  tickerStore: rootStore.tickers,
}))
class CreateNewItemView extends React.Component<Props, IState> {

  constructor(props) {
    super(props)
    const item = this.getPortfolioItem()
    this.state = {
      symbol: item ? item.symbolId : '',
      buyPriceUsd: item ? item.pricePerUnitPaid : null,
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

  // dunno what event type...
  onClickListener = (event: any): void => {
    if (event.key === 'Enter') {
      this.submit()
    } else if (event.key === 'Escape') {
      this.goBack()
    }
  }

  private handleOverlayClick = () => {
    this.goBack()
  }

  private handleModalClick = (event: any) => {
    event.stopPropagation()
  }

  private handlePriceChange = (price: number) => {
    this.setState({
      buyPriceUsd: price,
    })
  }

  private handleAmountChange = (amount: string) => {
    this.setState({
      numberOfUnits: parseFloat(amount),
    })
  }

  private handleSymbolChange = (symbolId: string) => {
    this.setState({ symbol: symbolId })
  }

  private handleExchangeChange = (event: any) => {
    let value = event.target.value
    if (value === 'default') {
      value = null
    }
    this.setState({
      exchangeId: value,
    })
  }

  private handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    this.submit()
  }

  private handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    this.goBack()
  }

  private handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const item = this.getPortfolioItem()
    this.goBack()
    if (item) {
      item.delete()
    }
  }

  private isValidItem = () => {
    return (
      this.state.symbol.length > 1
      && this.state.buyPriceUsd
      && this.state.numberOfUnits
    )
  }

  private isCoinSelected = () => {
    return !!this.state.symbol
  }

  private submit = () => {
    if (this.isValidItem()) {
      const item = this.getPortfolioItem()
      if (item) {
        this.updateItem()
      } else {
        this.createNewItem()
      }
    }
    this.goBack()
  }

  private updateItem = () => {
    const { buyPriceUsd, numberOfUnits, exchangeId } = this.state
    const item = this.getPortfolioItem()!
    item.exchangeId = exchangeId
    item.pricePerUnitPaid = buyPriceUsd!
    item.numberOfUnits = numberOfUnits!
  }

  private createNewItem = () => {
    const { symbol, buyPriceUsd, numberOfUnits, exchangeId } = this.state
    this.props.portfolioStore!.addItem(symbol, buyPriceUsd!, numberOfUnits!, exchangeId)
  }

  private goBack() {
    this.props.history.goBack()
  }

  private getPortfolioItem = () => {
    return this.props.portfolioStore!.getItem(this.props.match.params.id)
  }

  private filterSymbolSuggestions = (item: TickerModel, value: string) => {
    const tickerName = item.name.toLowerCase()
    const valueLowerCase = value.toLowerCase()
    return !value || item.id.includes(valueLowerCase) || tickerName.includes(valueLowerCase)
  }

  private renderSymbolInput = ({ ref, ...rest }) => (
    <Input
      {...rest}
      style={{ textTransform: 'uppercase' }}
      innerRef={ref}
      blurOnInput
      disabled={!!this.getPortfolioItem()}
      placeholder={'e.g. eth'}
    />
  )

  private renderSymbolSuggestion = (item, isHighlighted) => (
    <div
      key={item.id}
      style={{
        background: isHighlighted ? theme.colors.neutral : 'none',
        padding: '5px',
      }}
      >
      {`${item.name} (${item.id.toUpperCase()})`}
    </div>
  )

  public render() {
    const { numberOfUnits, symbol, buyPriceUsd, exchangeId } = this.state
    const { styles, tickerStore } = this.props
    const supportedExchanges = this.props.tickerStore!.getSupportedExchanges(symbol)
    const isNewItem = !this.getPortfolioItem()

    return (
      <div
        className={styles.overlay}
        onClick={this.handleOverlayClick}
      >
        <div className={styles.root} onClick={this.handleModalClick}>
          <Box>
            <Flex justify={'center'}>
              <h2>{isNewItem ? 'Add new Coin' : 'Edit Coin'}</h2>
            </Flex>
            <Box>
              <p>Currency: </p>
              <Autocomplete
                value={symbol}
                items={tickerStore!.tickers.slice()}
                shouldItemRender={this.filterSymbolSuggestions}
                onChange={(_e, val) => this.handleSymbolChange(val)}
                onSelect={val => this.handleSymbolChange(val)}
                getItemValue={(item) => item.id}
                renderItem={this.renderSymbolSuggestion}
                renderInput={this.renderSymbolInput}
                menuStyle={{
                  background: theme.colors.neutral1,
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
              <p>Exchange: </p>
              <select
                className={styles.exchangeSelector}
                disabled={!this.isCoinSelected()}
                value={exchangeId || 'default'}
                onChange={this.handleExchangeChange}
              >
                <option value={'default'}>Default</option>
                {supportedExchanges.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </Box>
            <Box mb={1}>
              <p>Buy amount: </p>
              <Input
                blurOnInput
                type={'number'}
                handleReturn={(_e, val) => this.handleAmountChange(val)}
                defaultValue={numberOfUnits ? numberOfUnits.toString() : ''}
              />
            </Box>
            <Box mb={1}>
              <p>Buy Price: </p>
              <Input
                blurOnInput
                type={'number'}
                defaultValue={buyPriceUsd ? buyPriceUsd.toString() : ''}
                handleReturn={(_e, val) => this.handlePriceChange(parseFloat(val))}
              />
            </Box>
            <Flex justify="center" mt={3}>
              <Box mx={1}>
                <Button
                  disabled={!this.isValidItem()}
                  onClick={this.handleSubmit}
                  >
                  {isNewItem ? 'OK': 'Save'}
                </Button>
              </Box>
              <Box mx={1}>
                <Button onClick={this.handleCancel}>Cancel</Button>
              </Box>
              {!isNewItem &&
                <Box mx={1}>
                  <Button style={{ backgroundColor: theme.colors.red }} onClick={this.handleDelete}>Remove</Button>
                </Box>
              }
            </Flex>
          </Box>
        </div>
      </div>
    );
  }
}

export default withStyles(CreateNewItemView)