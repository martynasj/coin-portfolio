import * as React from 'react'
import { FelaWithStylesProps, connect } from 'react-fela'
import { roundPercentage, roundCurrency } from '../../util/number-formatting'
import { theme } from '../../theme'

interface OwnProps {
  worth: number
  invested: number
  change: number
  changePercentage: number
  locked: boolean
}

interface Styles {
  totalWorth
  changesWrapper
}

type Props = OwnProps & FelaWithStylesProps<OwnProps, Styles>

const withStyles = connect<OwnProps, Styles>({
  totalWorth: {
    color: theme.colors.accent,
    textAlign: 'center',
    fontSize: '36px',
  },
  changesWrapper: {
    color: theme.colors.textLight,
    display: 'flex',
    maxWidth: '400px',
    margin: '0 auto',
    justifyContent: 'center',
  },
})

export class TotalsPanel extends React.Component<Props> {
  render() {
    const { worth, invested, change, changePercentage, styles, locked } = this.props

    const color = invested < worth ? theme.colors.green : theme.colors.red

    return (
      <div>
        {!locked &&
          <h2 className={styles.totalWorth}>{roundCurrency(worth)}</h2>
        }
        <div className={styles.changesWrapper}>
          <p>Profit: </p>
          <p style={{ color: color }}>{roundPercentage(changePercentage)}</p>
          {!locked &&
            <p style={{ color: color }}>{roundCurrency(change)}</p>
          }
        </div>
      </div>
    )
  }
}

export default withStyles(TotalsPanel)