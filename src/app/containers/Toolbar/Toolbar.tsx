import React from 'react'
import { Flex } from 'reflexbox'
import { inject, observer } from 'mobx-react'
import { OrderType } from '../../stores/SettingsStore'
import { Button } from '../../components'
import { theme } from '../../theme'

@inject((allStores: RootStore) => ({
  portfolio: allStores.portfolio,
  settingsStore: allStores.settings,
}))
@observer
class Toolbar extends React.Component<{}, {}> {
  private portfolio: PortfolioStore
  private settingsStore: SettingsStore

  constructor(props) {
    super(props)
    this.portfolio = props.portfolio!
    this.settingsStore = props.settingsStore!
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

  private handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as OrderType
    this.settingsStore.setOrderBy(value)
  }

  public render() {
    const isUnlocked = this.portfolio.isUnlocked

    return (
      <Flex>
        <Flex
          m={2}
          style={{
            margin: 0
          }}
        >
          {isUnlocked &&
            <Button
              style={{
                backgroundColor: 'transparent',
                color: theme.colors.neutral2,
                padding: 0,
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
              onClick={this.handleLock}>
              Lock
            </Button>
          }
          {!isUnlocked &&
            <Button
              style={{
                backgroundColor: 'transparent',
                color: theme.colors.neutral2,
                padding: 0,
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
              onClick={this.handleUnlock}>
              Unlock
            </Button>
          }
          <Flex ml={1} align="center">
            <select value={this.settingsStore.orderBy} onChange={this.handleOrderChange}>
              {this.settingsStore.orderTypes.map(type => (
                <option key={type.value} value={type.value}>{type.name}</option>
              ))}
            </select>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

export default Toolbar