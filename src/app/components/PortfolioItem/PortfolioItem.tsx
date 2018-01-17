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
  root: {
    backgroundColor: theme.colors.neutral2,
    borderRadius: '8px',
    padding: '30px 50px',
    border: `1px solid ${theme.colors.neutral2}`,
    boxShadow: '2px 3px 3px 0px #00000038',
    color: theme.colors.text,
    fontSize: '1.1rem'
  },
  symbol: {
    color: theme.colors.textLight,
    textTransform: 'uppercase',
  },
  name: {
    color: theme.colors.white,
    fontSize: '1.5rem',
    fontWeight: 500,
  },
  icon: {
    height: '1.3rem',
    marginRight: '10px',
  },
  title: {
    fontSize: '13px',
    padding: '3px',
    margin: 0,
  },
  value: {
    color: theme.colors.textLight,
    padding: '3px',
    margin: 0,
  },
  changePercentage: {
    fontSize: '1.8rem',
    fontWeight: 500,
    margin: 0,
    padding: '3px',
  },
  change: {
    margin: 0,
    padding: '3px',
  },
  changeIcon: {
    paddingTop: '5px',
    height: '7px',
    marginRight: '7px',
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

  private get changeIcon() {
    if(this.props.currentPrice > this.props.buyPrice) {
      return up;
    } else {
      return down;
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
<<<<<<< HEAD
    } = this.props

    return (
      <Box mb={2} className={styles.root}>
        <Flex >

          <Flex w={1/3} style={{alignItems: 'center'}}>
            <Box>

              <Flex mb={1} className={styles.name} style={{alignItems: 'center'}}>
                <img className={styles.icon} src={icon}/> 
                <span>{name}</span>
              </Flex>

              <Box mb={1} className={styles.symbol}>
                <span>{numberOfUnits}</span>
                <span>{" " + symbol}</span>
              </Box>

=======
      locked,
      onClick,
    } = this.props

    return (
      <Box mb={2} className={styles.root} onClick={onClick}>
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
>>>>>>> origin/master
            </Box>
          </Flex>

          <Flex w={1/3}>

            <Box
              w={1/2}
              style={{
                textAlign: 'right',
                paddingRight: '10px',
                borderRight: '2px solid #122535'
              }}
            >
              <Box  style={{padding: '5px 0'}}>
                <p className={styles.title}>Buy Price</p>
                <p className={styles.value}>{"$" + buyPrice}</p>
              </Box>

              <Box style={{padding: '5px 0'}}>
                <p className={styles.title}>Total Invested</p>
                <p className={styles.value}>{roundCurrency(totalBuyValue || 0)}</p>
              </Box>
            </Box>

            <Box w={1/2} style={{paddingLeft: '10px'}}>
              <Box style={{padding: '5px 0'}}>
                <p className={styles.title}>Current Price</p>
                <p className={styles.value}>{"$" + roundNumber(currentPrice || 0)}</p>  
              </Box>

              <Box style={{padding: '5px 0'}}>
                <p className={styles.title}>Total Worth</p>
                <p className={styles.value}>{roundCurrency(totalValue || 0)}</p>
              </Box>
            </Box>

          </Flex>

          <Flex w={1/3} style={{alignItems: 'center'}}>
            <Box style={{textAlign: 'right', marginLeft: 'auto'}}>

              <Flex style={{alignItems: 'center',}}>
                <img className={styles.changeIcon} src={this.changeIcon}/>
                <p className={styles.changePercentage} style={{color: this.color}}>{roundPercentage(changePercentage || 0)}</p>
              </Flex>

              <Box>
                <p className={styles.change} style={{color: this.color}}>{roundCurrency(change || 0)}</p>
              </Box>
              
            </Box>
          </Flex>

        </Flex>
      </Box>
    )
  }
}

export default withStyles(PortfolioItem)

