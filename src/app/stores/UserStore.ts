import { observable, runInAction, action, computed } from 'mobx'
import { ApiService } from '../api'

export class UserStore {
  private unsubPortfolios

  rootStore: RootStore
  @observable hasLoadedUser: boolean = false
  @observable hasLoadedPortfolios: boolean = false
  @observable currentUser: Api.User|null
  @observable portfolios: Api.PortfolioOnly[] = []
  @observable activePortfolioId: string

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    this.currentUser = null  // could be initialized from localStorage later
    this.startSyncAuthState()
  }

  // public

  public async logout() {
    await ApiService.auth.logout()
  }

  @computed
  public get hasLoadedState(): boolean {
    return this.hasLoadedPortfolios && this.hasLoadedUser
  }

  @action
  public setActivePortfolio(id: string) {
    this.activePortfolioId = id
  }

  // private

  private startSyncAuthState() {
    ApiService.auth.onAuthStateChange(user => {
      let hasLoadedUser = true

      if (user && !this.currentUser) {
        this.startSyncingPortfolios(user.id)
        hasLoadedUser = true
      } else if (this.currentUser && !user) {
        this.stopSyncingPortfolios()
        // todo: is this actually correct flow?
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
      this.unsubPortfolios = ApiService.portfolio.syncUserPortfolios(userId, portfolios => {
        runInAction(() => {
          this.portfolios = portfolios
          this.hasLoadedPortfolios = true
          // this.rootStore.ui.setActivePortfolio(portfolios[0].id)
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
    } else {
      throw new Error('Unsubscribe without subscribe')
    }
  }
}