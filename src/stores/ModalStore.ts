import React from 'react'
import { observable, action } from 'mobx'
import CreateNewItemView from '../containers/CreateNewItemView'

const modalTypes = {
  TRANSACTION: 'TRANSACTION',
}

export class ModalStore {
  // @ts-ignore
  private store: RootStore
  @observable public modalType: string | null
  @observable public props: {} | null

  constructor(rootStore: RootStore) {
    this.store = rootStore
    this.modalType = null
  }

  public get modalTypes() {
    return modalTypes
  }

  public get modalComponent(): React.ComponentType | null {
    if (this.modalType) {
      const map = {
        [modalTypes.TRANSACTION]: CreateNewItemView,
      }
      return map[this.modalType] || null
    } else {
      return null
    }
  }

  // todo: add type safety on props
  @action
  public showModal(modalType: string, props = {}): void {
    this.modalType = modalType
    this.props = props
  }

  @action
  public closeModal(): void {
    this.modalType = null
    this.props = null
  }
}
