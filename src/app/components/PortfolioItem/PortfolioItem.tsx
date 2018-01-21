import * as React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { Box, Flex } from 'reflexbox'
import { roundNumber, roundCurrency, roundPercentage } from '../../util/number-formatting'
import { theme } from '../../theme'
import icon from './icon.svg'
import up from './up.svg'
import down from './down.svg'

interface OwnProps {
  key?: string
  symbol: string
  name: string
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
  onClick: () => void
}

interface Styles {
  root
  symbol
  name
  icon
  title
  value
  changePercentage
  change
  changeIcon
}

type Props = OwnProps & FelaWithStylesProps<OwnProps, Styles>

const withStyles = connect<OwnProps, Styles>({
  root: props => ({
    background: 'linear-gradient(-60deg, #14181f, #4e5967)',
    borderRadius: '8px',
    padding: '15px 35px',
    boxShadow: '0 4px 5px 1px #141e2d6e',
    color: theme.colors.text,
    fontSize: theme.fontSizes.regular,
    cursor: props.locked ? 'auto' : 'pointer'
  }),
  symbol: {
    color: theme.colors.textLight,
    textTransform: 'uppercase',
  },
  name: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.medium,
    fontWeight: 500,
  },
  icon: {
    height: '1rem',
    marginRight: '5px',
  },
  title: {
    fontSize: theme.fontSizes.small,
    padding: '2px',
    margin: 0,
  },
  value: {
    color: theme.colors.textLight,
    padding: '2px',
    margin: 0,
  },
  changePercentage: {
    fontSize: theme.fontSizes.medium,
    fontWeight: 500,
    margin: 0,
    padding: '3px',
  },
  change: {
    margin: 0,
    padding: '3px',
  },
  changeIcon: {
    paddingTop: '3px',
    height: '8px',
    marginRight: '5px',
  }
})

class PortfolioItem extends React.Component<Props, {}> {

  private get color(): string {
    if (this.props.currentPrice) {
      return this.props.buyPrice < this.props.currentPrice ? theme.colors.green : theme.colors.red
    } else {
      return 'initial'
    }
  }

  private get changeIcon(): string|undefined {
    if (this.props.currentPrice) {
      if (this.props.currentPrice > this.props.buyPrice) {
        return up
      } else {
        return down
      }
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
      name,
      totalBuyValue,
      totalValue,
      onClick,
    } = this.props

    return (
      <Box mb={1} className={styles.root} onClick={onClick}>
        <Flex>
          <Flex w={1/4} align='center'>
            <Box>

              <Flex mb={1} className={styles.name} align='center'>
                <img className={styles.icon} src={icon}/>
                <span>{name}</span>
              </Flex>

              <Box mb={1} className={styles.symbol}>
                <span>{numberOfUnits}</span>
                <span>{" " + symbol}</span>
              </Box>

            </Box>
          </Flex>

          <Flex w={2/4}>

            <Box
              w={1/2}
              style={{
                textAlign: 'right',
                paddingRight: '15px',
                borderRight: '1px solid #496271'
              }}
            >
              <Box  style={{padding: '3px 0'}}>
                <p className={styles.title}>Buy Price</p>
                <p className={styles.value}>{"$" + buyPrice}</p>
              </Box>

              <Box style={{padding: '3px 0'}}>
                <p className={styles.title}>Total Invested</p>
                <p className={styles.value}>{roundCurrency(totalBuyValue || 0)}</p>
              </Box>
            </Box>

            <Box w={1/2} style={{paddingLeft: '15px'}}>
              <Box style={{padding: '3px 0'}}>
                <p className={styles.title}>Current Price</p>
                <p className={styles.value}>{"$" + roundNumber(currentPrice || 0)}</p>
              </Box>

              <Box style={{padding: '3px 0'}}>
                <p className={styles.title}>Total Worth</p>
                <p className={styles.value}>{roundCurrency(totalValue || 0)}</p>
              </Box>
            </Box>

          </Flex>

          <Flex w={1/4} align='center'>
            <Box style={{textAlign: 'right', marginLeft: 'auto'}}>

              <Flex style={{alignItems: 'center',}}>
                {this.changeIcon &&
                  <img className={styles.changeIcon} src={this.changeIcon}/>
                }
                <p
                  className={styles.changePercentage}
                  style={{color: this.color}}
                >
                  {roundPercentage(changePercentage || 0)}
                </p>
              </Flex>

              <Box>
                <p
                 className={styles.change}
                  style={{color: this.color}}
                >
                  {roundCurrency(change || 0)}
                </p>
              </Box>

            </Box>
          </Flex>

        </Flex>
      </Box>
    )
  }
}

export default withStyles(PortfolioItem)

