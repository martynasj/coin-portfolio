import React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
import _ from 'lodash'
import { theme } from '../../theme'

export interface IProps extends React.AllHTMLAttributes<HTMLAllCollection> { // todo: not sure about text field types
    inline?: boolean
    inverted?: boolean
    xs?: boolean
    small?: boolean
    large?: boolean
    xl?: boolean
    light?: boolean
    success?: boolean
    error?: boolean
    thin?: boolean
    bold?: boolean
}

interface Styles {
    root
    xs
    small
    large
    xl
    light
    success
    error
    thin
    bold
}

type Props = IProps & FelaWithStylesProps<IProps, Styles>

const withStyles = connect<IProps, Styles>({
    root: props => ({
        color: !props.inverted ? theme.colors.text : theme.colors.textInverted,
        fontSize: theme.fontSizes.regular,
        fontWeight: 500
    }),
    xs: { fontSize: theme.fontSizes.extraSmall },
    small: { fontSize: theme.fontSizes.small },
    large: { fontSize: theme.fontSizes.medium },
    xl: { fontSize: theme.fontSizes.big },
    light: props => ({ color: !props.inverted ? theme.colors.textLight : theme.colors.textInvertedLight }),
    success: { color: theme.colors.green },
    error: { color: theme.colors.red },
    thin: { fontWeight: 300 }, // Either I am too tired, or fela can't read our 'theme.fontWeight.thin' integer :O
    bold: { fontWeight: 700 },
})

const Text = ({ styles, inline, xs, small, large, xl, light, success, error, thin, bold, children }: Props) => {
    const classNames = _.compact([
        styles.root,
        xs && styles.xs,
        small && styles.small,
        large && styles.large,
        xl && styles.xl,
        light && styles.light,
        success && styles.success,
        error && styles.error,
        thin && styles.thin,
        bold && styles.bold,
    ]).join(' ')

    return (
        inline ? <span className={classNames}>{children}</span> : <p className={classNames}>{children}</p>
    )
}
export default withStyles(Text)