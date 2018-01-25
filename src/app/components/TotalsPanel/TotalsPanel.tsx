import * as React from 'react'
import { FelaWithStylesProps, connect } from 'react-fela'
import { roundPercentage, roundCurrency } from '../../util/number-formatting'
import { theme } from '../../theme'
import { Flex, Box } from 'reflexbox'
import { Text } from '../../components'

interface OwnProps {
  worth: number|null
  invested: number
  change: number
  changePercentage: number
  locked: boolean
}

interface Styles {
  totalWorth
  changesWrapper
  changePercentage
  change
  title
  invested
}

type Props = OwnProps & FelaWithStylesProps<OwnProps, Styles>

const withStyles = connect<OwnProps, Styles>({
  totalWorth: {
    color: theme.colors.neutral2,
    textAlign: 'center',
    fontSize: theme.fontSizes.extraLarge,
    margin: 0,
  },
  invested: {
    color: theme.colors.neutral2,
    fontSize: theme.fontSizes.big,
    fontWeight: 500,
    margin: 0,
    padding: '3px',
  },
  changesWrapper: {
    textAlign: 'right',
  },
  changePercentage: {
    fontWeight: 500,
    padding: '3px',
  },
  change: {
    padding: '3px',
  },
  title: {
    padding: '2px',
  },
})

export class TotalsPanel extends React.Component<Props> {
  render() {
    const { worth, invested, change, changePercentage, styles, locked } = this.props

    const color = invested < (worth || 0) ? theme.colors.green : theme.colors.red

    return (
      <Flex justify='space-between'>
        <Box w={1/3}>
          <div>
            <Text light inverted small className={styles.title}>Total invested</Text>
            <Text large style={{ fontWeight: 500 }}>{"$" + invested}</Text>
          </div>
        </Box>
        <Box w={1/3} style={{textAlign: 'center'}}>
          <Text light inverted small className={styles.title}>Balance</Text>
          {!locked &&
            <h2 className={styles.totalWorth}>{roundCurrency(worth || 0)}</h2>
          }
        </Box>
        <Box w={1/3} className={styles.changesWrapper}>
          <div>
            <Text light inverted small>Total profit</Text>
            <Text large className={styles.changePercentage} style={{color: color}}>{roundPercentage(changePercentage)}</Text>
          </div>
            {!locked &&
              <Text className={styles.change} style={{ color: color, padding: '3px' }}>
                {roundCurrency(change)}
              </Text>
            }
        </Box>
      </Flex>
    )
  }
}

export default withStyles(TotalsPanel)