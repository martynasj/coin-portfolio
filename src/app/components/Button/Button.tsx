import React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { theme } from '../../theme'


export interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  simple?: boolean
}

interface Styles {
  button
}

type Props = IProps & FelaWithStylesProps<IProps, Styles>

const withStyles = connect<IProps, Styles>({
  button: props => ({
    borderRadius: '6px',
    padding: '8px 16px',
    backgroundColor: props.simple ? 'transparent' : theme.colors.accent,
    color: props.simple ? theme.colors.accent : theme.colors.white,
    border: props.simple ? `1px solid ${theme.colors.accent}` : 'none',
    fontSize: '14px',
    opacity: props.disabled ? 0.6 : undefined,
    cursor: props.disabled ? 'default' : 'pointer',
  }),
})

class Button extends React.Component<Props, {}> {
  public render() {
    const { styles, rules, children, ...rest } = this.props
    return (
      <button {...rest} className={styles.button}>
        {children}
      </button>
    )
  }
}

export default withStyles(Button)