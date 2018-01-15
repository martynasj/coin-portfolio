import React from 'react'
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
    this.state = {
      symbol: '',
      buyPriceUsd: null,
      numberOfUnits: null,
      exchangeId: null,
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

  private handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (this.isValidItem()) {
      const { symbol, buyPriceUsd, numberOfUnits, exchangeId } = this.state
      this.props.portfolioStore!.addItem(symbol, buyPriceUsd!, numberOfUnits!, exchangeId)
    }
    this.goBack(e)
  }

  private handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.goBack(e)
  }

  private goBack(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    this.props.history.goBack()
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