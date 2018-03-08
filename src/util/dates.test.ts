import dates from './dates'

describe('dates', () => {
  test('fromUnix', () => {
    const unix = dates.toUnix(new Date('2015-01-01'))
    expect(unix).toBe(1420070400)
  })

  test('toUnix', () => {
    const date = dates.fromUnix(1420070400)
    expect(date.getTime()).toBe(1420070400 * 1000)
  })
})