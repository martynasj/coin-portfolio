import * as React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { Box } from 'reflexbox'
import { Input } from '../../components'
import { roundNumber, roundCurrency, roundPercentage } from '../../util/number-formatting'
import { theme } from '../../theme'


interface OwnProps {
  key?: string
  symbol: string
  currentPrice: number
  buyPrice: number
  numberOfUnits: number
  changePercentage: number
  change: number
  totalBuyValue: number
  totalValue: number
  locked: boolean
  onAmountChange: (amount: number) => void
  onBuyPriceChange: (price: number) => void
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

  render() {
    const {
      symbol,
      currentPrice,
      buyPrice,
      numberOfUnits,
      change,
      changePercentage,
      styles,
      totalBuyValue,
      totalValue,
      locked,
    } = this.props

    const color = buyPrice < currentPrice ? theme.colors.green : theme.colors.red

    return (
      <Box mb={2} className={styles.root}>
        <Box mb={1} className={styles.symbol}>{symbol}</Box>
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
            <div>Invested: {roundCurrency(totalBuyValue)}</div>
            <div>Worth: {roundCurrency(totalValue)}</div>
            <div>
              <span>Profit: </span>
              <span style={{ color: color }}>{roundCurrency(change)}</span>
            </div>
          </Box>
        }
        <div>Current price: {"$" + roundNumber(currentPrice)}</div>
        <div>
          <span>Profit: </span>
          <span style={{ color: color }}>{roundPercentage(changePercentage)}</span>
        </div>
      </Box>
    )
  }
}

export default withStyles(PortfolioItem)