import { observable, runInAction, action, computed } from 'mobx'
import { ApiService } from '../api'

export class UserStore {
  private unsubPortfolios
  private apiService: ApiService

  rootStore: RootStore
  @observable hasLoadedUser: boolean = false
  @observable hasLoadedPortfolios: boolean = false
  @observable currentUser: Api.User|null
  @observable portfolios: Api.PortfolioOnly[] = []

  constructor(rootStore: RootStore, apiService: ApiService) {
    this.rootStore = rootStore
    this.apiService = apiService
    this.currentUser = apiService.auth.getPersistedUser()
    this.startSyncAuthState()
  }

  // public

  public async logout() {
    await this.apiService.auth.logout()
  }

  @computed
  public get hasLoadedState(): boolean {
    return this.hasLoadedPortfolios && this.hasLoadedUser
  }

  // private

  private startSyncAuthState() {
    this.apiService.auth.onAuthStateChange(user => {
      let hasLoadedUser = true

      if (user) {
        this.startSyncingPortfolios(user.id)
        hasLoadedUser = true
      } else if (this.currentUser && !user) {
        this.stopSyncingPortfolios()
        // todo: is this actually correct flow?
        hasLoadedUser = false
      } else if (!user) {
        hasLoadedUser = false
      }

      this.setUser(user)
      runInAction(() => {
        this.hasLoadedUser = hasLoadedUser
      })
    })
  }

  @action
  public setUser(user: Api.User|null) {
    this.currentUser = user
  }

  private startSyncingPortfolios(userId: string) {
    if (!this.unsubPortfolios) {
      this.unsubPortfolios = this.apiService.portfolio.syncUserPortfolios(userId, portfolios => {
        runInAction(() => {
          this.portfolios = portfolios
          this.hasLoadedPortfolios = true
        })
      })
    } else {
      throw new Error('Sync portfolio when one is already in sync.')
    }
  }

  @action
  private stopSyncingPortfolios() {
    if (this.unsubPortfolios) {
      this.unsubPortfolios()
      this.hasLoadedPortfolios = false
      this.unsubPortfolios = null
    } else {
      throw new Error('Unsubscribe without subscribe')
    }
  }
}