import { action, observable, autorun } from "mobx";

// todo: should we keep list of routes somewhere?
export const routes = {
  dashboard: "/dashboard"
};

export class UIStore {
  rootStore: RootStore;
  @observable activePortfolioId: string;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    autorun(() => {
      const pathname = rootStore.router.location!.pathname;
      this.syncActivePortfolioId(pathname);
    });
  }

  @action
  public setActivePortfolio(id: string) {
    this.activePortfolioId = id;
    this.rootStore.router.history!.push(`${routes.dashboard}/${id}`);
  }

  @action
  private syncActivePortfolioId(pathname: string) {
    const match = pathname.match(/\/dashboard\/(.+)/)
    if (match) {
      const portfolioId = match[1]
      this.activePortfolioId = portfolioId
    }
  }

}
