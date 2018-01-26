import React from 'react'
import { Flex } from 'reflexbox'
import { inject, observer } from 'mobx-react'
import { OrderType } from '../../stores/SettingsStore'

@inject((allStores: RootStore) => ({
  settingsStore: allStores.settings,
}))
@observer
class Toolbar extends React.Component<{}, {}> {
  private settingsStore: SettingsStore

  constructor(props) {
    super(props)
    this.settingsStore = props.settingsStore!
  }

  private handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as OrderType
    this.settingsStore.setOrderBy(value)
  }

  public render() {
    return (
      <Flex>
        <Flex
          m={2}
          style={{
            margin: 0
          }}
        >
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