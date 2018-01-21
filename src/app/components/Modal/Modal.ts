import React from 'react'
import * as ReactDOM from 'react-dom'
import { theme } from '../../theme'

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  style?: {}
  onOverlayClick: (e: React.MouseEvent<HTMLElement>) => void
}

class Modal extends React.Component<IProps> {

  componentWillMount() {
    document.getElementById('root')!.style.filter = 'blur(3px)'
  }

  componentWillUnmount() {
    document.getElementById('root')!.style.filter = 'none'
  }

  handleOverlayClick(e) {
    this.props.onOverlayClick(e)
  }

  handleModalClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }
  
  render() {
    return ReactDOM.createPortal(
      React.createElement('div', {
        onClick: (e) => this.handleOverlayClick(e),
        style: overlay,
      },
        React.createElement('div', {
          onClick: (e) => this.handleModalClick(e),
          style: { ...root, ...this.props.style}
        },
          this.props.children
        )
      ),
      document.getElementById('modal-root')!,
    )
  }
}

export default Modal

const overlay = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  position: 'fixed',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)'
}

const root = {
  width: '400px',
  padding: '16px',
  margin: '10% auto',
  backgroundColor: theme.colors.neutral,
  borderRadius: '8px',
  boxShadow: '2px 3px 3px 0px #00000038',
}