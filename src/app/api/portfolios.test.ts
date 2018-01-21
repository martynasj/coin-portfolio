import * as portfolioService from './portfolios'

describe('api/portfolios', () => {
  test('abc', async () => {
    await portfolioService.createNewPortfolio('one-two')
    const portfolio = await portfolioService.fetchPortfolio('one-two')
    expect(portfolio.id).toBe('one-two')
  })
})