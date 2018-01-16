import * as React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { Box, Flex } from 'reflexbox'
import { roundNumber, roundCurrency, roundPercentage } from '../../util/number-formatting'
import { theme } from '../../theme'
import img from './shitfolio-icon.svg'

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
      styles,
      totalBuyValue,
      totalValue,
    } = this.props

    return (
      <Box 
        mb={2} 
        className={styles.root}
        style={{
          width: '50%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >

        <Flex 
          style={{
            justifyContent: 'space-between',
          }}
        >

          <Box>
            <Box 
              mb={1} className={styles.symbol}
              style={{
                textTransform: 'Capitalize',
                color: '#ffffff',
              }}
            >
              <span><img src={img}/></span> 
              <span>{symbol}</span>
            </Box>
            <Box mb={1}>
              <p>{numberOfUnits}</p>
            </Box>
          </Box>

          <Flex>
            <Box
              style={{
                textAlign: 'right',
                marginRight: '10px',
              }}
            >
              <Box mb={1}>
                <p
                  style={{
                    fontSize: '12px'
                  }}
                >
                  Buy Price
                </p>
                <p>{"$" + buyPrice}</p>
              </Box>
              <Box>
                <div>
                  <p>Total Invested</p>
                  <p>{roundCurrency(totalBuyValue || 0)}</p>
                </div>
              </Box>
            </Box>

            <Box
              style={{
                marginLeft: '10px',
              }}
            >
              <Box>
                <div>
                  <p>Current Price</p>
                  <p>{"$" + roundNumber(currentPrice || 0)}</p>  
                </div>
              </Box>
              <Box>
                <div>
                  <p>Total Worth</p>
                  <p>{roundCurrency(totalValue || 0)}</p>
                </div>
              </Box>
            </Box>
          </Flex>

          <Box>
            <Box>
              <div>
                <p style={{ color: this.color }}>{roundPercentage(changePercentage || 0)}</p>
              </div>
            </Box>

            <Box>
              <div>
                <p style={{ color: this.color }}>{roundCurrency(change || 0)}</p>
              </div>
            </Box>
          </Box>

        </Flex>

      </Box>
    )
  }
}

export default withStyles(PortfolioItem)