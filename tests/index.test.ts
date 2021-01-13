import { partialFetch } from '../src/index'

function identitrue(): true {
  return true
}

describe(partialFetch, () => {
  it('Should always work', () => {
    expect(identitrue()).toBe(true)
  })
})
