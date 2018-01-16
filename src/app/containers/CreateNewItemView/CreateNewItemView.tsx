import React, { KeyboardEvent } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { Flex, Box } from 'reflexbox'
import { Input } from '../../components'
import { RootStore } from '../../stores/RootStore';

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

@observer
@inject((rootStore: RootStore) => ({
  portfolioStore: rootStore.portfolio,
  tickerStore: rootStore.tickers,
}))
class CreateNewItemView extends React.Component<IProps, IState> {

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

  public render() {
    const { numberOfUnits, symbol, buyPriceUsd, exchangeId } = this.state
    const supportedExchanges = this.props.tickerStore!.getSupportedExchanges(symbol)

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <div
          style={{
            maxWidth: 400,
            padding: 16,
            margin: '10% auto',
            backgroundColor: 'black',
          }}
        >
          <Box>
            <Box mb={1}>
              <h2>Add new Coin</h2>
              <Input
                blurOnInput
                placeholder={'e.g. eth'}
                defaultValue={symbol}
                handleReturn={(_e, val) => this.handleSymbolChange(val)}
              />
            </Box>
            <Box mb={1}>
              <p>Exchange: </p>
              <select
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
                handleReturn={(_e, val) => this.handleAmountChange(val)}
                defaultValue={numberOfUnits ? numberOfUnits.toString() : ''}
              />
            </Box>
            <Box mb={1}>
              <p>Buy Price: </p>
              <Input
                blurOnInput
                defaultValue={buyPriceUsd ? buyPriceUsd.toString() : ''}
                handleReturn={(_e, val) => this.handlePriceChange(parseFloat(val))}
              />
            </Box>
            <Flex justify="center">
              <button onClick={this.handleSubmit}>OK</button>
              <button onClick={this.handleCancel}>Cancel</button>
            </Flex>
          </Box>
        </div>
      </div>
    );
  }
}

export default CreateNewItemView