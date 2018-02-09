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
}

interface Styles {
  title
}

type Props = OwnProps & FelaWithStylesProps<OwnProps, Styles>

const withStyles = connect<OwnProps, Styles>({
  title: {
    paddingRight: '8px'
  },
})

export class TotalsPanel extends React.Component<Props> {
  render() {
    const { worth, invested, change, changePercentage, styles } = this.props

    const color = invested < (worth || 0) ? theme.colors.green : theme.colors.red

    return (
      <Box>
        <Flex justify='flex-end' my={'0.2rem'}>
          <Text xl bold>{roundCurrency(worth || 0)}</Text>
        </Flex>

        <Flex justify='flex-end' align='center' my={'0.2rem'}>
          <Text light small className={styles.title}>Total invested</Text>
          <Text semibold>{roundCurrency(invested || 0)}</Text>
        </Flex>

        <Flex justify='flex-end' align='center' my={'0.2rem'}>
          <Text light small className={styles.title}>Total profit</Text>
          <Text semibold style={{color: color}}>{roundPercentage(changePercentage)} / {roundCurrency(change)}</Text>
        </Flex>
      </Box>
    )
  }
}

export default withStyles(TotalsPanel)