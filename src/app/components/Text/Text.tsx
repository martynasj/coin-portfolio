import React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
import { theme } from '../../theme'

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    center?: boolean
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
    uppercase?: boolean
}

interface Styles {
    root
}

type Props = IProps & FelaWithStylesProps<IProps, Styles>

const withStyles = connect<IProps, Styles>({
    root: ({ center, inverted, xs, small, large, xl, light, success, error, thin, bold, uppercase }) => ({
        color:
            inverted ? light ? theme.colors.textInvertedLight : theme.colors.textInverted :
            light ? theme.colors.textLight :
            success ? theme.colors.green :
            error ? theme.colors.red :
            theme.colors.text,
        fontSize:
            xs ? theme.fontSizes.extraSmall :
            small ? theme.fontSizes.small :
            large ? theme.fontSizes.big :
            xl ? theme.fontSizes.extraLarge :
            theme.fontSizes.regular,
        fontWeight:
            thin ? theme.fontWeight.thin :
            bold ? theme.fontWeight.bold :
            theme.fontWeight.regular,
        textTransform: uppercase ? 'uppercase' : 'none',
        padding: '2px',
        textAlign: center ? 'center' : undefined,
    })
})

const Text: React.SFC<Props> = (props: Props) => {
    const {
        styles,
        rules,
        inline,
        className,
        light,
        center,
        inverted,
        xs,
        small,
        large,
        xl,
        success,
        error,
        thin,
        bold,
        uppercase,
        ...rest
    } = props

    return React.createElement(inline ? 'span' : 'p', {
        className: styles.root + ' ' + className,
        ...rest,
    })
}
export default withStyles(Text)