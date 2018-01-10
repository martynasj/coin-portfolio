import React from 'react'
import { Flex } from 'reflexbox'
import { inject, observer } from 'mobx-react'

interface Props extends RootStore {}

@inject((allStores: RootStore) => ({
  portfolio: allStores.portfolio,
}))
@observer
class Toolbar extends React.Component<Props, {}> {

  private handleAddNewCoin = () => {
    // this.props.portfolio.addItem(parsed.symbolId, parsed.buyPrice, parsed.numberOfUnits)
  }

  private handleLock = () => {
    if (this.props.portfolio.hasLock) {
      return this.props.portfolio.lockPortfolio()
    }

    const passcode = prompt('Enter pass code you want to use')
    if (passcode) {
      this.props.portfolio.addLock(passcode)
    }
  }

  private handleUnlock = () => {
    const passcode = prompt('Enter Passcode')
    if (passcode) {
      this.props.portfolio.unlockPortfolio(passcode)
    }
  }

  public render() {
    const { portfolio } = this.props
    const isUnlocked = portfolio.isUnlocked

    return (
      <Flex>
        <Flex my={2}>
          {isUnlocked &&
            <button onClick={this.handleAddNewCoin}>
              Add A Coin
            </button>
          }
          {isUnlocked &&
            <button onClick={this.handleLock}>
              Lock
            </button>
          }
          {!isUnlocked &&
            <button onClick={this.handleUnlock}>
              Unlock
            </button>
          }
        </Flex>
      </Flex>
    );
  }
}

export default Toolbar