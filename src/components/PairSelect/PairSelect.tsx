import React from 'react'
import Downshift, { DownshiftInterface } from 'downshift'
import { Box } from 'reflexbox'
import { Input } from '../../components'
import { PairModel } from '../../models'

export interface OwnProps {
  pairs: PairModel[]
  disabled: boolean
  value: PairModel | null
  fluid: boolean
  onChange: (pair: PairModel) => void
}

type RenderItemOptions = {
  item: PairModel
  selectedItem: PairModel
  isHighlighted: boolean
  getItemProps: (...any) => void
}

export default class PairSelect extends React.Component<OwnProps, any> {
  private downshift: DownshiftInterface | null

  private handleInputFocus = () => {
    if (this.downshift) {
      // @ts-ignore
      this.downshift.openMenu()
    }
  }

  private shouldRenderItem = (inputValue: string | null, item: PairModel) => {
    return (
      !inputValue ||
      item
        .getPairString()
        .toLowerCase()
        .includes(inputValue.toLowerCase())
    )
  }

  renderItem({ item, getItemProps, selectedItem, isHighlighted }: RenderItemOptions) {
    return (
      <Box
        {...getItemProps({ item })}
        key={item.id}
        p={1}
        style={{
          cursor: 'pointer',
          backgroundColor: isHighlighted ? 'yellow' : undefined,
          fontWeight: selectedItem === item ? 'bold' : 'normal',
        }}
      >
        {item.getPairString()}
      </Box>
    )
  }

  render() {
    const { pairs, onChange, value, disabled, fluid } = this.props

    return (
      <Downshift
        ref={node => (this.downshift = node as any)}
        selectedItem={value}
        itemToString={(pair: PairModel) => (pair ? pair.getPairString() : '')}
        onChange={onChange}
        render={({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
          <div style={{ position: 'relative', display: fluid ? 'block' : 'inline-block' }}>
            <Input
              fluid
              onFocus={this.handleInputFocus}
              disabled={disabled}
              {...getInputProps({ placeholder: 'Select Trading Pair' })}
            />
            {isOpen ? (
              <div
                style={{
                  border: '1px solid #ccc',
                  position: 'absolute',
                  borderRadius: '8px',
                  margin: '0',
                  width: '100%',
                  left: 0,
                  maxHeight: 200,
                  backgroundColor: 'white',
                  overflow: 'auto',
                }}
              >
                {pairs.filter(item => this.shouldRenderItem(inputValue, item)).map((item, index) => {
                  const isHighlighted = index === highlightedIndex
                  return this.renderItem({ item, isHighlighted, getItemProps, selectedItem })
                })}
              </div>
            ) : null}
          </div>
        )}
      />
    )
  }
}
