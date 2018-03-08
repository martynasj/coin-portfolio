import { initFirebase } from '../../setup/test-utils'
import history from './history'

describe('api/history', () => {
  beforeAll(() => {
    initFirebase()
  })

  test('gets the closest historical data', async () => {
    // todo: finish implementing this test and add more cases
    const date = new Date('2017-09-05')
    const entry = await history.getClosestEntry(date)
    expect(entry!.date).toEqual(date)
  })
})
