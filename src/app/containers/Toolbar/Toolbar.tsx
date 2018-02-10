import React from 'react'
import { Box } from 'reflexbox'
import { inject, observer } from 'mobx-react'
import { Button, Text } from '../../components'
import { OrderType, PriceMode } from '../../stores/SettingsStore'

interface InjectProps {
  settingsStore?: SettingsStore
  modal?: ModalStore
}

@inject((allStores: RootStore) => ({
  settingsStore: allStores.settings,
  modal: allStores.modal,
}))
@observer
class Toolbar extends React.Component<InjectProps, {}> {
  private settingsStore: SettingsStore

  constructor(props) {
    super(props)
    this.settingsStore = props.settingsStore!
  }

  private handleAddItemClick = () => {
    const modalStore = this.props.modal!
    modalStore.showModal(modalStore.modalTypes.TRANSACTION, { id: 'abc' })
  }

  private handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as OrderType
    this.settingsStore.setOrderBy(value)
  }

  private handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as PriceMode
    this.settingsStore.setPriceMode(value)
  }

  public render() {
    return (
      <Box py={2} flex align={'center'} justify={'space-between'}>
        <Box>
          <Button onClick={this.handleAddItemClick}>Add Coin +</Button>
        </Box>
        <Box flex>
          <Box mr={2}>
            <Text small light>
              Order By
            </Text>
            <select value={this.settingsStore.orderBy} onChange={this.handleOrderChange}>
              {this.settingsStore.orderTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.name}
                </option>
              ))}
            </select>
          </Box>
          <Box>
            <Text small light>
              Mode
            </Text>
            <select value={this.settingsStore.priceMode} onChange={this.handleModeChange}>
              {this.settingsStore.pricesModes.map(mode => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </Box>
        </Box>
      </Box>
    )
  }
}

export default Toolbar
