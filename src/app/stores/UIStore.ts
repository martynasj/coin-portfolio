import { action, observable, autorun } from 'mobx'

// todo: should we keep list of routes somewhere?
export const routes = {
    dashboard: '/dashboard'
}

export class UIStore {
    rootStore: RootStore
    @observable activePortfolioId: string

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
        autorun(() => {
            const pathname = rootStore.router.location!.pathname
            const hasLoadedPortfolios = rootStore.user.hasLoadedPortfolios
            this.syncActivePortfolioId(pathname, hasLoadedPortfolios)
        })
    }

    public goToPortfolio(id: string) {
      this.rootStore.router.history!.push(`${routes.dashboard}/${id}`)
    }

    @action
    public setActivePortfolio(id: string) {
      this.activePortfolioId = id
    }

    @action
    syncActivePortfolioId(pathname: string, hasLoadedPortfolios: boolean) {
        if (hasLoadedPortfolios) {
            let portfolio = this.rootStore.user.portfolios.find(item => pathname.includes(item.id))
            if (portfolio) {
                this.setActivePortfolio(portfolio.id)
            } else if (pathname === routes.dashboard) {
                this.setActivePortfolio(this.rootStore.user.portfolios[0].id)
            }
        }
    }
}