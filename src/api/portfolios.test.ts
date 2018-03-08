import { initFirebase } from '../../setup/test-utils'
import portfolioService from './portfolios'

describe('api/portfolios', () => {
  beforeAll(() => {
    initFirebase()
  })

  test('create new portfolio', async () => {
    const id = await portfolioService.createNewPortfolio({ ownerId: 'abc', name: 'Main' })
    const portfolio = await portfolioService.fetchPortfolio(id)
    expect(portfolio.id).toBe(id)
    expect(portfolio.ownerId).toBe('abc')
  })
})
