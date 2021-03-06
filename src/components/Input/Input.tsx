import React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { theme } from '../../theme'

interface OwnProps extends BaseInputProps, React.InputHTMLAttributes<HTMLInputElement> {
  handleReturn?: (e: React.SyntheticEvent<HTMLInputElement>, value: string) => void
  blurOnInput?: boolean
  innerRef?: any
}

export interface BaseInputProps {
  fluid?: boolean
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  placeholder?: string
}

interface Styles {
  input
}

type Props = OwnProps & FelaWithStylesProps<OwnProps, Styles>

const withStyles = connect<OwnProps, Styles>({
  input: props => ({
    padding: '8px 12px',
    backgroundColor: props.disabled ? theme.colors.neutralLight : 'transparent',
    border: `1px solid ${theme.colors.neutral}`,
    borderRadius: '6px',
    color: theme.colors.text,
    outline: 'none',
    fontSize: theme.fontSizes.regular,
    width: props.fluid ? '100%' : undefined,
  }),
})

class Input extends React.Component<Props, {}> {
  private input: HTMLInputElement | null = null

  private handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
  }

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e)
    }
    if (e.key === 'Enter' || e.key === 'Tab') {
      this.handleReturn(e)
    }
  }

  private handleReturn = (e: React.SyntheticEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const { handleReturn, blurOnInput } = this.props
    if (handleReturn) {
      const value = this.input!.value
      handleReturn(e, value)
    }
    if (blurOnInput) {
      this.input!.blur()
    }
  }

  public render() {
    const { styles, rules, handleReturn, blurOnInput, innerRef, fluid, ...rest } = this.props

    return (
      <input
        {...rest}
        ref={innerRef ? innerRef : node => (this.input = node)}
        className={styles.input}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleBlur}
      />
    )
  }
}

export default withStyles(Input)
