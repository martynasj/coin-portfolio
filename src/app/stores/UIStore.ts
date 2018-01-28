import { action, observable, autorun } from 'mobx'

export const routes = {
    dashboard: '/dashboard'
}

export class UIStore {
    rootStore: RootStore
    @observable activePortfolioId: string

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
        // if (rootStore.router.history) {
        //     this.syncActivePortfolioId()
        // }
        autorun(() => {
            const pathname = rootStore.router.location!.pathname
            const hasLoadedPortfolios = rootStore.user.hasLoadedPortfolios
            this.syncActivePortfolioId(pathname, hasLoadedPortfolios)
        })
        // observe(this.rootStore.user.hasLoadedPortfolios, change => console.log(change))
        
    }

    @action
    public setActivePortfolio(id: string) {
      this.activePortfolioId = id
    }

    @action
    syncActivePortfolioId(pathname: string, hasLoadedPortfolios: boolean) {
        if (hasLoadedPortfolios) {
            let portfolio = this.rootStore.user.portfolios.find(item => pathname.includes(item.id))
            console.log(this.rootStore.router.history)
            if (portfolio) {
                this.setActivePortfolio(portfolio.id)
            } else if (pathname === routes.dashboard) {
                this.setActivePortfolio(this.rootStore.user.portfolios[0].id)
            }
        }
    }
    // private syncActivePortfolioId(): void {
    //     console.log(this.rootStore.user.hasLoadedPortfolios)
    //     this.rootStore.router.history!.listen(location => {
    //         if (location.pathname.includes(routes.dashboard)) {
    //             runInAction(() => {
    //                 console.log(location)
    //                 if (location.pathname.split('/')[2]) {
    //                     this.setActivePortfolio(location.pathname.split('/')[2])
    //                 } else {
    //                     this.setActivePortfolio(this.rootStore.user.portfolios[0].id)
    //                 }
    //             })
    //         }
    //     })
    // }
}