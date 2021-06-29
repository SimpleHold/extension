// Currencies
import { generateWallet as RippleGenerateWallet } from '@utils/currencies/ripple'
import { generateWallet as ThetaGenerateWallet } from '@utils/currencies/theta'
import { generateAddress as Web3GenerateWallet } from '@utils/web3'

// Config
import addressValidate from '@config/addressValidate'

test('Check Ripple generate wallet', () => {
  const wallet = RippleGenerateWallet()
  expect(wallet).not.toBeNull()

  if (wallet) {
    const isAddressValid = new RegExp(addressValidate.xrp).test(wallet.address)
    expect(isAddressValid).toBe(true)
  }
})

test('Check Theta generate wallet', () => {
  const wallet = ThetaGenerateWallet()
  expect(wallet).not.toBeNull()

  if (wallet) {
    const isAddressValid = new RegExp(addressValidate.theta).test(wallet.address)
    expect(isAddressValid).toBe(true)
  }
})

test('Check Web3 generate wallet', () => {
  const wallet = Web3GenerateWallet()
  expect(wallet).not.toBeNull()

  if (wallet) {
    const isAddressValid = new RegExp(addressValidate.eth).test(wallet.address)
    expect(isAddressValid).toBe(true)
  }
})
