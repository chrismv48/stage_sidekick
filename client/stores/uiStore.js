import {observable} from 'mobx'

export class UiStore {

  @observable modalType
  @observable modalProps
  @observable selectedResourceId = null
  @observable selectedResource = null

  @observable displayMode = 'cards'

  constructor(rootStore) {
    this.rootStore = rootStore

    this.hideModal = this.hideModal.bind(this)
    this.showResourceSidebar = this.showResourceSidebar.bind(this)
    this.hideResourceSidebar = this.hideResourceSidebar.bind(this)
    this.setDisplayMode = this.setDisplayMode.bind(this)
  }

  showModal(modalType, modalProps) {
    this.modalType = modalType
    this.modalProps = modalProps
  }

  hideModal() {
    this.modalType = null
    this.modalProps = null
  }

  showResourceSidebar(resource, resourceId) {
    this.selectedResource = resource
    this.selectedResourceId = resourceId
  }

  hideResourceSidebar() {
    this.selectedResource = null
    this.selectedResourceId = null
  }

  setDisplayMode(displayMode) {
    this.displayMode = displayMode
  }

}
