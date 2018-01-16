import * as React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { Box } from 'reflexbox'
import { Input } from '../../components'
import { roundNumber, roundCurrency, roundPercentage } from '../../util/number-formatting'
import { theme } from '../../theme'


interface OwnProps {
  key?: string
  symbol: string
  currentPrice?: number|null
  buyPrice: number
  numberOfUnits: number
  changePercentage?: number|null
  change?: number|null
  selectedExchange?: string|null
  supportedExchanges?: string[]
  totalBuyValue?: number
  totalValue?: number|null
  locked: boolean
  isTempItem?: boolean
  onAmountChange: (amount: number) => void
  onBuyPriceChange: (price: number) => void
  onSymbolChange: (symbol: string) => void
  onExchangeChange: (selectedExchange: string|null) => void
  onSubmit?: () => void
  onCancel?: () => void
}

interface Styles {
  root
  symbol
}

type Props = OwnProps & FelaWithStylesProps<OwnProps, Styles>

const withStyles = connect<OwnProps, Styles>({
  root: {
    backgroundColor: theme.colors.neutral1,
    borderRadius: '8px',
    padding: '12px',
    border: `1px solid ${theme.colors.neutral2}`,
    boxShadow: '2px 3px 3px 0px #00000038',
    color: theme.colors.textLight,
  },
  symbol: {
    color: theme.colors.text,
    fontSize: '28px',
  },
})

class PortfolioItem extends React.Component<Props, {}> {

  private handleAmountInput = (value: string) => {
    this.props.onAmountChange(parseFloat(value))
  }

  private handleBuyPriceInput = (value: string) => {
    this.props.onBuyPriceChange(parseFloat(value))
  }

  private handleSymbolChange = (value: string) => {
    this.props.onSymbolChange(value)
  }

  private handleExchangeChange = (event: any) => {
    let value = event.target.value
    if (value === 'default') {
      value = null
    }
    this.props.onExchangeChange(value)
  }

  private isTempItem = (): boolean => {
    return !!this.props.isTempItem
  }

  private isCoinSelected = (): boolean => {
    return !!this.props.symbol
  }

  private get color(): string {
    if (this.props.currentPrice) {
      return this.props.buyPrice < this.props.currentPrice ? theme.colors.green : theme.colors.red
    } else {
      return 'initial'
    }
  }

  render() {
    const {
      symbol,
      currentPrice,
      buyPrice,
      numberOfUnits,
      change,
      changePercentage,
      selectedExchange,
      supportedExchanges,
      styles,
      totalBuyValue,
      totalValue,
      locked,
      ...rest,
    } = this.props

    return (
      <Box {...rest} mb={2} className={styles.root}>
        <Box mb={1} className={styles.symbol}>
          {this.isTempItem() ?
            <Input
              blurOnInput
              placeholder={'e.g. eth'}
              defaultValue={symbol}
              handleReturn={(_e, val) => this.handleSymbolChange(val)}
            /> :
            <span>{symbol}</span>
          }
        </Box>
          <Box mb={1}>
          {this.isCoinSelected() &&
            <select value={selectedExchange || 'default'} onChange={this.handleExchangeChange}>
              <option value={'default'}>Default</option>
              {supportedExchanges!.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          }
          </Box>
        <Box mb={1}>
          <span>Buy Price: </span>
          <Input
            blurOnInput
            disabled={locked}
            defaultValue={buyPrice.toString()}
            handleReturn={(_e, val) => this.handleBuyPriceInput(val)}
          />
        </Box>
        {!locked &&
          <Box>
            <Box mb={1}>
              <span>Buy amount: </span>
              <Input
                blurOnInput
                disabled={locked}
                handleReturn={(_e, val) => this.handleAmountInput(val)}
                defaultValue={numberOfUnits.toString()}
              />
            </Box>
            {!this.isTempItem() &&
              <div>
                <div>Invested: {roundCurrency(totalBuyValue || 0)}</div>
                <div>Worth: {roundCurrency(totalValue || 0)}</div>
                <div>
                  <span>Profit: </span>
                  <span style={{ color: this.color }}>{roundCurrency(change || 0)}</span>
                </div>
                <div>Current price: {"$" + roundNumber(currentPrice || 0)}</div>
                <div>
                  <span>Profit: </span>
                  <span style={{ color: this.color }}>{roundPercentage(changePercentage || 0)}</span>
                </div>
              </div>
            }
          </Box>
        }
        {this.isTempItem() && (
          <div>
            <button onClick={this.props.onSubmit}>Ok</button>
            <button onClick={this.props.onCancel}>Cancel</button>
          </div>
        )}
      </Box>
    )
  }
}

export default withStyles(PortfolioItem)