import React from 'react'
import NumInput from 'react-numeric-input'
import { BaseInputProps } from '../Input/Input'

type Func = () => void

export interface OwnProps extends BaseInputProps {
  step?: number
  min?: number
  max?: number
  precision?: number
  maxLength?: number
  parse?: Func
  format?: Func
  snap?: boolean
  onChange: (numberValue: number | null, stringValue: string, input: any) => void
  onInvalid?: Func
  onValid?: Func
  value: number | string | null
  defaultValue?: number | string
}

class NumberInput extends React.Component<OwnProps, any> {
  render() {
    const { fluid, ...rest } = this.props
    const styles = {
      input: {
        padding: '8px 12px', // these styles cannot fully overwrite lib styles :(
        width: '100%',
      },
      wrap: {
        display: fluid ? 'block' : 'inline-block',
      },
    }
    return <NumInput style={styles} {...rest} />
  }
}

export default NumberInput
