import { PortfolioStore, RootStore } from './index'

class MockApiService {}

function initRootStore() {
  const rootStore = new RootStore(null, MockApiService)
}

describe('PortfolioStore', () => {
  it('Works', () => {
    initRootStore()
  })
})
