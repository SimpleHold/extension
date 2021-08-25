import * as currencies from '@utils/currencies'

describe('Import private key', () => {
  it('should return bitcoin address', async () => {
    const importPK = currencies.importPrivateKey('btc', '1KthJjNYKFNLz7H79N4mqeythPs1RmDcW8')
    expect(importPK).toBe('KxxqTH1WJ1VmzSZFYLkYjWE6VSivbN8B5Ko7PMGhQZdjzuCWmuja')
  })

  it('should return bitcoin-cash address', async () => {
    const importPK = currencies.importPrivateKey(
      'bch',
      'L4V9osQBi3Gq6xTfxZ89Y61qoVz93w84ibS45Y8YoMuogCRMzA2Y'
    )
    expect(importPK).toBe('bitcoincash:qqy6gwwk5mq8mjgdz7lc4r9redru6233yvk0fjqsnk')
  })

  it('should return bitcoin-sv address', async () => {
    const importPK = currencies.importPrivateKey(
      'bsv',
      'L52af9G6rABFESPsnGGfR2i96azU3JNhUxjsi6dLthAekzNmtSzp'
    )
    expect(importPK).toBe('1FU7n3bm4W5UQWoVn2cipBb9CaW8CEmYfp')
  })

  it('should return litecoin address', async () => {
    const importPK = currencies.importPrivateKey(
      'ltc',
      'TAzP4KRK2k5R1YrWUzEu1BdTJ6Fd2vpsadY44FpmB3WvbzqAT6Qw'
    )
    expect(importPK).toBe('LKMbv7YNzSETXpPc6QtZxMv4YegAGEeCNi')
  })

  it('should return dogecoin address', async () => {
    const importPK = currencies.importPrivateKey(
      'ltc',
      'QRrHnBReU5ZfEcEjCAAV7vaXz5vuVmBfX6ApLdPuQZFG4PZ963An'
    )
    expect(importPK).toBe('D5mA6vSDhhy6bX78MXReFCxSaZd3UHtfd8')
  })

  it('should return dash address', async () => {
    const importPK = currencies.importPrivateKey(
      'dash',
      'XHsrT35ZYs9uQ8FLgPThCcKNV8Q5shYhoXGSfSFqSN9fXKmgR3iv'
    )
    expect(importPK).toBe('XyN7nfaVMedhtkZW42dfezwqB2K4YwDrKY')
  })

  it('should return ethereum address', async () => {
    const importPK = currencies.importPrivateKey(
      'eth',
      '0xd9671e4722f8a847fe0b4da024f9d758adef67050413c40b9a7b0cdb04c39107'
    )
    expect(importPK).toBe('0xD91aAaA87a52a3c01D32df7DC0C0D7104968cA7B')
  })

  it('should return theta address', async () => {
    const importPK = currencies.importPrivateKey(
      'theta',
      '0x22a8b603367cf62b6bbaf07e84fb6cde8b3533f7c7ce3aaef22c62089f0b40ae'
    )
    expect(importPK).toBe('0xbF8c48b0a5529D3BEFE6E45fB2D33173dcBb7C2e')
  })

  it('should return xrp address', async () => {
    const importPK = currencies.importPrivateKey('xrp', 'shcWci7aGNBF9ZDoJ8yczRTPyYhjv')
    expect(importPK).toBe('r4YWw722QqDvphi9bfVV12TLhQwchijvMR')
  })

  it('should return neblio address', async () => {
    const importPK = currencies.importPrivateKey(
      'nebl',
      'TnCumNdT5o5cRo1P8Er4nMKnBdaYUcBxfiYiqrjgj7ZsHVeS7s9E'
    )
    expect(importPK).toBe('NYgCiSPRM7b5M29erVcu98g1pGJtipNb85')
  })

  it('should return nuls address', async () => {
    const importPK = currencies.importPrivateKey(
      'nuls',
      '514e30ab817d1234633001019f9d2f2a2a910ad160823d5d5f22bdb13ece13e2'
    )
    expect(importPK).toBe('NULSd6HghhFs4kVtN3L8NKuiaKZMza5odo4Cy')
  })
})
