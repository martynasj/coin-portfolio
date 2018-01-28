import React from 'react'
import { connect, FelaWithStylesProps } from 'react-fela'
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
    semibold?: boolean
    bold?: boolean
    uppercase?: boolean
    capitalize?: boolean
    m1?: boolean
    m2?: boolean
    m3?: boolean
}

interface Styles {
    root
}

type Props = IProps & FelaWithStylesProps<IProps, Styles>

const withStyles = connect<IProps, Styles>({
    root: ({ inverted, xs, small, large, xl, light, success, error, thin, semibold, bold, uppercase, capitalize, m1, m2, m3 }) => ({
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
            semibold ? theme.fontWeight.semibold :
            bold ? theme.fontWeight.bold :
            theme.fontWeight.regular,
        textTransform: 
            uppercase ? 'uppercase' :
            capitalize ? 'capitalize' :
            'none',
        margin:
            m1 ? theme.margin.m1 :
            m2 ? theme.margin.m2 :
            m3 ? theme.margin.m3 :
            'inherit',
    })
})

const Text = ({ styles, inline, children, style, className }: Props) => {
    return (
        inline ? <span className={styles.root + ' ' + className} style={style}>{children}</span> : <p className={styles.root + ' ' + className} style={style}>{children}</p>
    )
}
export default withStyles(Text)