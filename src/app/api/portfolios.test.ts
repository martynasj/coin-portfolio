import { initFirebase } from '../../../setup/test-utils'
import * as portfolioService from './portfolios'

describe('api/portfolios', () => {
  beforeAll(() => {
    initFirebase()
  })

  test('create new portfolio', async () => {
    await portfolioService.createNewPortfolio('one-two', { ownerId: 'fakeid33' })
    const portfolio = await portfolioService.fetchPortfolio('one-two')
    expect(portfolio.id).toBe('one-two')
  })
})