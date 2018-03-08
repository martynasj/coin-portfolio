import _ from 'lodash'

export function average(numbers: number|number[]) {
  const nums = _.isArray(numbers) ? numbers : [numbers]
  const sum = _.reduce(nums, (r, n) => r + n, 0)
  return sum / nums.length
}