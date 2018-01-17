import React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { theme } from '../../theme'


export interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}

interface Styles {
  button
}

type Props = IProps & FelaWithStylesProps<IProps, Styles>

const withStyles = connect<IProps, Styles>({
  button: props => ({
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    backgroundColor: theme.colors.accent,
    color: 'white',
    fontSize: '14px',
    opacity: props.disabled ? 0.6 : undefined,
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