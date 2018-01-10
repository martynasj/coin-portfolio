import React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { theme } from '../../theme'

export interface OwnProps extends React.InputHTMLAttributes<HTMLInputElement> {
  handleReturn?: (e: React.KeyboardEvent<HTMLInputElement>, value: string) => void
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
  },
})

class Input extends React.Component<Props, {}> {
  private input: HTMLInputElement|null = null

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { handleReturn, blurOnInput } = this.props
    const key = e.key
    if (key === 'Enter' || key === 'Tab') {
      if (handleReturn) {
        const value = this.input!.value
        handleReturn(e, value)
        if (blurOnInput) {
          this.input!.blur()
        }
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
        ref={node => this.input = node}
        className={styles.input}
        onKeyDown={this.handleKeyDown}
        {...rest}
      />
    )
  }
}

export default withStyles(Input)