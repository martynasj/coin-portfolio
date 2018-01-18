import React from 'react'
import { Flex } from 'reflexbox'
import { inject, observer } from 'mobx-react'
import { Button } from '../../components'
import { theme } from '../../theme'

@inject((allStores: RootStore) => ({
  portfolio: allStores.portfolio,
}))
@observer
class Toolbar extends React.Component<{}, {}> {
  portfolio: PortfolioStore

  constructor(props) {
    super(props)
    this.portfolio = props.portfolio!
  }

  private handleLock = () => {
    if (this.portfolio.hasLock) {
      return this.portfolio.lockPortfolio()
    }

    const passcode = prompt('Enter pass code you want to use')
    if (passcode) {
      this.portfolio.addLock(passcode)
    }
  }

  private handleUnlock = () => {
    const passcode = prompt('Enter Passcode')
    if (passcode) {
      this.portfolio.unlockPortfolio(passcode)
    }
  }

  public render() {
    const isUnlocked = this.portfolio.isUnlocked

    return (
      <Flex>
        <Flex m={2}>
          {isUnlocked &&
            <Button
              style={{
                backgroundColor: theme.colors.neutral2
              }}
              onClick={this.handleLock}>
              Lock
            </Button>
          }
          {!isUnlocked &&
            <Button
              style={{
                backgroundColor: theme.colors.neutral2
              }}
              onClick={this.handleUnlock}>
              Unlock
            </Button>
          }
        </Flex>
      </Flex>
    );
  }
}

export default Toolbar