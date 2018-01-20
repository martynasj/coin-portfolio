import { observable, runInAction } from 'mobx'
import { ApiService } from '../api'

export class UserStore {
  rootStore: RootStore
  @observable hasLoadedUser: boolean = false
  @observable currentUser: Api.User|null

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    this.currentUser = null  // could be initialized from localStorage later
    this.startSyncAuthState()
  }

  public async logout() {
    await ApiService.auth.logout()
  }

  private startSyncAuthState() {
    ApiService.auth.onAuthStateChange(user => {
      runInAction(() => {
        this.hasLoadedUser = true
        this.currentUser = user
      })
    })
  }
}