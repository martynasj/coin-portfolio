import React from 'react'
import { Flex } from 'reflexbox'
import { inject, observer } from 'mobx-react'
import { OrderType } from '../../stores/SettingsStore'
import { theme } from '../../theme'
import arrow from './arrow.svg'

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
        <select
          value={this.settingsStore.orderBy}
          onChange={this.handleOrderChange}
          style={{
            padding: '4px',
            borderBottom: `2px solid ${theme.colors.textInvertedLight}`,
            color: theme.colors.textLight,
            fontSize: theme.fontSizes.regular,
            minWidth: 'calc(100% + 15px)',
            backgroundImage: `url(${arrow})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '10px',
            backgroundPosition: 'right',
            cursor: 'pointer',
          }}
        >
          {this.settingsStore.orderTypes.map(type => (
            <option
              key={type.value}
              value={type.value}
            >
              {type.name}
            </option>
          ))}
        </select>

      </Flex>
    );
  }
}

export default Toolbar