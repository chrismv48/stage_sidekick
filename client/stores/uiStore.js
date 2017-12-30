import {observable} from 'mobx'

export class UiStore {

  @observable modalType
  @observable modalProps

  constructor(rootStore) {
    this.rootStore = rootStore

    this.hideModal = this.hideModal.bind(this)
  }

  showModal(modalType, modalProps) {
    this.modalType = modalType
    this.modalProps = modalProps
  }

  hideModal() {
    this.modalType = null
    this.modalProps = null
  }

}
