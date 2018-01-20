import React from 'react'
import * as ReactDOM from 'react-dom'

interface IProps {
  onOverlayClick: () => void
}

class ModalRoot extends React.Component<IProps> {

  componentWillMount() {
    document.getElementById('root')!.style.filter = 'blur(3px)'
  }

  componentWillUnmount() {
    document.getElementById('root')!.style.filter = 'none'
  }

  handleOverlayClick(props) {
    props.onOverlayClick()
  }
  
  render() {
    return ReactDOM.createPortal(
      React.createElement('div', {
        onClick: () => this.handleOverlayClick(this.props),
        style: modalRootStyles,
      },
        this.props.children),
      document.getElementById('modal-root')!,
    );
  }
}

export default ModalRoot

const modalRootStyles = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  position: 'fixed',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.3)'
}