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
    borderRadius: '6px',
    padding: '8px 16px',
    backgroundColor: theme.colors.accent,
    color: 'white',
    border: '1px solid #27babf',
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