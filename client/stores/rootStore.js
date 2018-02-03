import Api from 'api/api'

import {ResourceStore} from "./resourceStore";
import {UiStore} from "./uiStore";

export default class RootStore {

  constructor() {
    this.resourceStore = new ResourceStore(Api, this)
    this.uiStore = new UiStore(this)
  }
}
