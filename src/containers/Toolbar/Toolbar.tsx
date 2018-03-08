import React from 'react'
import { Box } from 'reflexbox'
import { inject, observer } from 'mobx-react'
import { Button, Text, Select } from '../../components'
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
            <Select
              value={this.settingsStore.orderBy}
              onChange={this.handleOrderChange}
              options={this.settingsStore.orderTypes.map(type => ({ text: type.name, value: type.value }))}
            />
          </Box>
          <Box>
            <Text small light>
              Mode
            </Text>
            <Select
              options={this.settingsStore.pricesModes.map(mode => ({ text: mode, value: mode }))}
              value={this.settingsStore.priceMode}
              onChange={this.handleModeChange}
            />
          </Box>
        </Box>
      </Box>
    )
  }
}

export default Toolbar
