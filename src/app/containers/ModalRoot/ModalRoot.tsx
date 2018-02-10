import * as React from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'

export interface InjectProps {
  modalStore?: ModalStore
}

@inject((store: RootStore) => ({
  modalStore: store.modal,
}))
@observer
export default class ModalRoot extends React.Component<InjectProps, any> {
  private modalRoot: HTMLElement

  constructor(props) {
    super(props)
    this.modalRoot = document.getElementById('modal-root')!
  }

  render() {
    const modalStore = this.props.modalStore!
    const CurrentModal = modalStore.modalComponent
    const props = modalStore.props || {}

    if (!CurrentModal) {
      return null
    }

    return ReactDOM.createPortal(<CurrentModal {...props} />, this.modalRoot)
  }
}
