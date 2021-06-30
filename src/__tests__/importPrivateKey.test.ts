// Currencies
import { importPrivateKey as RippleImportPrivateKey } from '@utils/currencies/ripple'
import { importPrivateKey as ThetaImportPrivateKey } from '@utils/currencies/theta'
import { importPrivateKey as Web3ImportPrivateKey } from '@utils/web3'
import { importPrivateKey as NeblioImportPrivateKey } from '@utils/currencies/neblio'
import { importPrivateKey as NulsImportPrivateKey } from '@utils/currencies/nuls'

describe('Import private key', () => {
  it('Import Ripple private key', () => {
    const wallet = {
      address: 'rJSPTsCbmQKuPzeKhV2Koc7BLZvwC9F9ja',
      privateKey: 'snDQ9oqFBKundBGX9KHqBi53ynKkg',
    }

    const importPK = RippleImportPrivateKey(wallet.privateKey)

    expect(importPK).not.toBeNull()
    expect(importPK).toEqual(wallet.address)
  })

  it('Import Theta private key', () => {
    const wallet = {
      address: '0x6ce063231e3d65894d970B3Fb6cc604eA4Ad3E74',
      privateKey: '0xd87b5086e2cc138b4a6a0cfbfcc0345829854e1b0a1513c9f21064b338c33687',
    }

    const importPK = ThetaImportPrivateKey(wallet.privateKey)

    expect(importPK).not.toBeNull()
    expect(importPK).toEqual(wallet.address)
  })

  it('Import Web3 private key', () => {
    const wallet = {
      address: '0xfF8B9Effc30F1fD7b6c48FA415d9874fCD693e95',
      privateKey: '0x1abb36915e73ce8db60f203a2be11715d9bfec78e6a7ba2b9c411eaedd066212',
    }

    const importPK = Web3ImportPrivateKey(wallet.privateKey)

    expect(importPK).not.toBeNull()
    expect(importPK).toEqual(wallet.address)
  })

  it('Import Neblio private key', () => {
    const wallet = {
      address: 'NdGrduAdHvHiwUekr1axYmRQNhFXpaRAhP',
      privateKey: 'Tr2AmDRidFnZzWPraitVre4ucVkitVZxoQhFuQVbCygH3R37b7bG',
    }

    const importPK = NeblioImportPrivateKey(wallet.privateKey)

    expect(importPK).not.toBeNull()
    expect(importPK).toEqual(wallet.address)
  })

  it('Import Nuls private key', () => {
    const wallet = {
      address: 'NULSd6HgYjC6mBRSwFUoVsgtrjrh4sDtE194t',
      privateKey: '7344ae44cd149385fd7451dd851a674de17ebb9fa0d133f8578b1d84ac65f087',
    }

    const importPK = NulsImportPrivateKey(wallet.privateKey)

    expect(importPK).not.toBeNull()
    expect(importPK).toEqual(wallet.address)
  })
})
