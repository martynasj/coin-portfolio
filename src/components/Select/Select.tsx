import React from 'react'

interface Option {
  value: string | number
  text: string
  disabled?: boolean
}

export interface OwnProps {
  disabled?: boolean
  options: Option[]
  value: string | string[] | number
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>, { newValue: T }) => void
}

export default class Select extends React.Component<OwnProps, any> {
  private handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    if (this.props.onChange) {
      this.props.onChange(e, { newValue })
    }
  }

  renderOption = (option: Option, idx: number) => {
    return (
      <option key={idx} value={option.value}>
        {option.text}
      </option>
    )
  }

  render() {
    const { options, value, ...rest } = this.props

    return (
      <select {...rest} value={value} onChange={this.handleChange}>
        {options.map((o, idx) => this.renderOption(o, idx))}
      </select>
    )
  }
}
