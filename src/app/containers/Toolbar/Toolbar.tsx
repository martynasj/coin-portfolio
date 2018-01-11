import React from 'react'
import { Flex } from 'reflexbox'
import { inject, observer } from 'mobx-react'

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

  private handleAddNewCoin = () => {
    const symbol = prompt('Enter symbol. e.g. btc or eth')
    if (symbol) {
      this.portfolio.addItem(symbol, 0, 0)
    }
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