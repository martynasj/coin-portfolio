import React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { theme } from '../../theme'

export interface OwnProps extends React.InputHTMLAttributes<HTMLInputElement> {
  handleReturn?: (e: React.SyntheticEvent<HTMLInputElement>, value: string) => void
  blurOnInput: boolean
}

interface Styles {
  input
}

type Props = OwnProps & FelaWithStylesProps<OwnProps, Styles>

const withStyles = connect<OwnProps, Styles>({
  input: {
    padding: '6px',
    backgroundColor: 'transparent',
    border: '2px solid',
    borderColor: theme.colors.neutral,
    borderRadius: '4px',
    color: theme.colors.text,
    outline: 'none',
    fontSize: '14px',
  },
})

class Input extends React.Component<Props, {}> {
  private input: HTMLInputElement|null = null

  private handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
    this.handleReturn(e)
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
    const { handleReturn, blurOnInput } = this.props
    if (handleReturn) {
      const value = this.input!.value
      handleReturn(e, value)
      if (blurOnInput) {
        this.input!.blur()
      }
    }
  }

  public render() {
    const {
      styles,
      rules,
      handleReturn,
      blurOnInput,
      ...rest
    } = this.props

    return (
      <input
        {...rest}
        ref={node => this.input = node}
        className={styles.input}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleBlur}
      />
    )
  }
}

export default withStyles(Input)