import React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, FelaWithStylesProps } from 'react-fela'
import { Box, Flex } from 'reflexbox'
import { theme } from '../../theme'


interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  style?: {}
  title?: string
  onOverlayClick: (e: React.MouseEvent<HTMLElement>) => void
}

interface IStyles {
  overlay
  dialog
  title
}

type Props = IProps & FelaWithStylesProps<IProps, IStyles>

const withStyles = connect<IProps, IStyles>({
  overlay: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    position: 'fixed',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  dialog: {
    width: '400px',
    backgroundColor: theme.colors.neutral,
    borderRadius: '8px',
    boxShadow: '2px 3px 3px 0px #00000038',
    overflow: 'hidden',
  },
  title: {
    height: '60px',
    color: theme.colors.white,
    backgroundColor: theme.colors.neutral1,
  }
})

class Modal extends React.Component<Props> {

  componentWillMount() {
    document.getElementById('root')!.style.filter = 'blur(3px)'
    document.body.style.overflow = 'hidden'
  }

  componentWillUnmount() {
    document.getElementById('root')!.style.filter = 'none'
    document.body.style.overflow = 'auto'
  }

  handleOverlayClick = (e) => {
    this.props.onOverlayClick(e)
  }

  handleModalClick = (e) => {
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  renderModalDialog = () => {
    const { styles, title } = this.props
    return (
      <Flex
        justify={'center'}
        align={'center'}
        className={styles.overlay}
        onClick={this.handleOverlayClick}
        >
        <Box onClick={this.handleModalClick} className={styles.dialog}>
          <Flex justify={'center'} align={'center'} className={styles.title}>
            <h2>{title}</h2>
          </Flex>
          <Box p={2}>
            {this.props.children}
          </Box>
        </Box>
      </Flex>
    )
  }
  
  render() {
    return ReactDOM.createPortal(this.renderModalDialog(), document.getElementById('modal-root')!)
  }
}

export default withStyles(Modal)
