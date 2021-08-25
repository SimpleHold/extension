import * as currencies from '@utils/currencies'

describe('Generate address', () => {
  it('should return bitcoin address', async () => {
    const generate = currencies.generate('btc')

    expect(generate).not.toBe(null)
    expect(generate?.address.length).not.toBe('')
  })
})
