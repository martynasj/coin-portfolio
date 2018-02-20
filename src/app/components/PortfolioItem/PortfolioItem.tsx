import * as React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { Box, Flex } from 'reflexbox'
import { roundNumber, roundCurrency, roundPercentage } from '../../util/number-formatting'
import { theme } from '../../theme'
import icon from './icon.svg'
import up from './up.svg'
import down from './down.svg'
import { Text } from '../../components'

interface OwnProps {
  key?: string
  symbol: string
  name: string
  currentPrice?: number | null
  buyPrice: number
  numberOfUnits: number
  changePercentage?: number | null
  profit?: number | null
  holdingStake: number
  marketValue?: number | null
  onClick: () => void
}

interface Styles {
  root
  icon
  changeIcon
}

type Props = OwnProps & FelaWithStylesProps<OwnProps, Styles>

const withStyles = connect<OwnProps, Styles>({
  root: () => ({
    background: 'linear-gradient(-60deg, #14181f, #4e5967)',
    borderRadius: '8px',
    padding: '15px 35px',
    boxShadow: '0 4px 5px 1px #141e2d6e',
    cursor: 'pointer',
  }),
  icon: {
    height: '1rem',
    marginRight: '5px',
  },
  changeIcon: {
    paddingTop: '3px',
    height: '8px',
    marginRight: '5px',
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

  private get changeIcon(): string | undefined {
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
      profit,
      changePercentage,
      styles,
      name,
      holdingStake,
      marketValue,
      onClick,
    } = this.props

    return (
      <Box mb={1} className={styles.root} onClick={onClick}>
        <Flex>
          <Flex w={1 / 4} align="center">
            <Box>
              <Flex mb={1} align="center">
                <img className={styles.icon} src={icon} />
                <Text inverted large style={{ color: theme.colors.white }}>
                  {name}
                </Text>
              </Flex>

              <Box mb={1}>
                <Text light inverted inline>
                  {numberOfUnits}
                </Text>
                <Text light inverted inline uppercase>
                  {' ' + symbol}
                </Text>
              </Box>
            </Box>
          </Flex>

          <Flex w={2 / 4}>
            <Box
              w={1 / 2}
              style={{
                textAlign: 'right',
                paddingRight: '15px',
                borderRight: '1px solid #496271',
              }}
            >
              <Box style={{ padding: '3px 0' }}>
                <Text small light style={{ padding: '2px' }}>
                  Avg Buy Price
                </Text>
                <Text light inverted style={{ padding: '2px' }}>
                  {'$' + buyPrice}
                </Text>
              </Box>

              <Box style={{ padding: '3px 0' }}>
                <Text small light style={{ padding: '2px' }}>
                  Stake
                </Text>
                <Text light inverted style={{ padding: '2px' }}>
                  {roundPercentage(holdingStake)}
                </Text>
              </Box>
            </Box>

            <Box w={1 / 2} style={{ paddingLeft: '15px' }}>
              <Box style={{ padding: '3px 0' }}>
                <Text small light style={{ padding: '2px' }}>
                  Current Price
                </Text>
                <Text light inverted style={{ padding: '2px' }}>
                  {'$' + roundNumber(currentPrice || 0)}
                </Text>
              </Box>

              <Box style={{ padding: '3px 0' }}>
                <Text small light style={{ padding: '2px' }}>
                  Market Value
                </Text>
                <Text light inverted style={{ padding: '2px' }}>
                  {roundCurrency(marketValue || 0)}
                </Text>
              </Box>
            </Box>
          </Flex>

          <Flex w={1 / 4} align="center">
            <Box style={{ textAlign: 'right', marginLeft: 'auto' }}>
              <Flex style={{ alignItems: 'center' }}>
                {this.changeIcon && <img className={styles.changeIcon} src={this.changeIcon} />}
                <Text large style={{ color: this.color, padding: '3px' }}>
                  {roundPercentage(changePercentage || 0)}
                </Text>
              </Flex>

              <Box>
                <Text style={{ color: this.color, padding: '3px' }}>{roundCurrency(profit || 0)}</Text>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Box>
    )
  }
}

export default withStyles(PortfolioItem)
