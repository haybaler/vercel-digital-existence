import { average } from '../deScore'

describe('deScore utilities', () => {
  test('average calculates mean of numbers', () => {
    expect(average([1, 2, 3, 4])).toBe(3)
  })

  test('average returns 0 for empty array', () => {
    expect(average([])).toBe(0)
  })
})
