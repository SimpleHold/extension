import { generateWallet as RippleGenerateWallet } from '@utils/currencies/ripple'
import { generateWallet as ThetaGenerateWallet } from '@utils/currencies/theta'
import { generateAddress as GenerateWeb3Wallet } from '@utils/web3'

test('Check Ripple generate wallet', () => {
  expect(RippleGenerateWallet()).not.toBeNull()
})

test('Check Theta generate wallet', () => {
  expect(ThetaGenerateWallet()).not.toBeNull()
})

test('Check web3 generate wallet', () => {
  expect(GenerateWeb3Wallet()).not.toBeNull()
})
