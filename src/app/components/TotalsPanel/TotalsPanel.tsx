import * as React from 'react'
import { FelaWithStylesProps, connect } from 'react-fela'
import { roundPercentage, roundCurrency } from '../../util/number-formatting'
import { theme } from '../../theme'
import { Flex, Box } from 'reflexbox'

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
    fontSize: theme.fontSizes.big,
    margin: 0,
  },
  invested: {
    color: theme.colors.neutral2,
    fontSize: theme.fontSizes.medium,
    fontWeight: 500,
    margin: 0,
    padding: '3px',
  },
  changesWrapper: {
    textAlign: 'right',
  },
  changePercentage: {
    fontSize: theme.fontSizes.medium,
    fontWeight: 500,
    margin: 0,
    padding: '3px',
  },
  change: {
    fontSize: theme.fontSizes.regular,
    margin: 0,
    padding: '3px',
  },
  title: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.textLight,
    padding: '2px',
    margin: 0,
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
            <p className={styles.title}>Total invested</p>
            <p className={styles.invested}>{"$" + invested}</p>
          </div>
        </Box>
        <Box w={1/3} style={{textAlign: 'center'}}>
          <p className={styles.title}>Balance</p>
          {!locked &&
            <h2 className={styles.totalWorth}>{roundCurrency(worth || 0)}</h2>
          }
        </Box>
        <Box w={1/3} className={styles.changesWrapper}>
          <div>
            <p className={styles.title}>Total profit</p>
            <p className={styles.changePercentage} style={{color: color}}>{roundPercentage(changePercentage)}</p>
          </div>
            {!locked &&
              <p className={styles.change} style={{color: color}}>{roundCurrency(change)}</p>
            }
        </Box>
      </Flex>
    )
  }
}

export default withStyles(TotalsPanel)