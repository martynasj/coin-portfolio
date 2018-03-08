export default {
  roundNumber(num: number): string {
    return num.toPrecision(6)
  },

  roundCurrency(num: number): string {
    return num.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  },

  roundPercentage(num: number): string {
    const value = Number(num) / 100
    return value.toLocaleString('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  },
}
