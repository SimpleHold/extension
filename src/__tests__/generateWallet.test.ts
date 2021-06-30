// Currencies
import { generateWallet as RippleGenerateWallet } from '@utils/currencies/ripple'
import { generateWallet as ThetaGenerateWallet } from '@utils/currencies/theta'
import { generateAddress as Web3GenerateWallet } from '@utils/web3'
import { generateWallet as NeblioGenerateWallet } from '@utils/currencies/neblio'
import { generateWallet as NulsGenerateWallet } from '@utils/currencies/nuls'

// Config
import addressValidate from '@config/addressValidate'

describe('Generate wallets', () => {
  it('Generate Ripple wallet', () => {
    const wallet = RippleGenerateWallet()
    expect(wallet).not.toBeNull()

    if (wallet) {
      const isAddressValid = new RegExp(addressValidate.xrp).test(wallet.address)
      expect(isAddressValid).toBe(true)
    }
  })

  it('Generate Theta wallet', () => {
    const wallet = ThetaGenerateWallet()
    expect(wallet).not.toBeNull()

    if (wallet) {
      const isAddressValid = new RegExp(addressValidate.theta).test(wallet.address)
      expect(isAddressValid).toBe(true)
    }
  })

  it('Generate Web3 wallet', () => {
    const wallet = Web3GenerateWallet()
    expect(wallet).not.toBeNull()

    if (wallet) {
      const isAddressValid = new RegExp(addressValidate.eth).test(wallet.address)
      expect(isAddressValid).toBe(true)
    }
  })

  it('Generate Neblio wallet', () => {
    const wallet = NeblioGenerateWallet()
    expect(wallet).not.toBeNull()

    if (wallet) {
      const isAddressValid = new RegExp(addressValidate.nebl).test(wallet.address)
      expect(isAddressValid).toBe(true)
    }
  })

  it('Generate Nuls wallet', () => {
    const wallet = NulsGenerateWallet()
    expect(wallet).not.toBeNull()
  })
})
