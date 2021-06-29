import {
  generateWallet as RippleGenerateWallet,
  importPrivateKey as RippleImportPrivateKey,
} from '@utils/currencies/ripple'
import {
  generateWallet as ThetaGenerateWallet,
  importPrivateKey as ThetaImportPrivateKey,
} from '@utils/currencies/theta'
import {
  generateAddress as GenerateWeb3Wallet,
  importPrivateKey as Web3ImportPrivateKey,
} from '@utils/web3'

test('Check Ripple import private key', () => {
  const wallet = RippleGenerateWallet()

  expect(wallet).not.toBeNull()

  if (wallet) {
    expect(RippleImportPrivateKey(wallet.privateKey)).not.toBeNull()
  } else {
    throw new Error('Ripple wallet not generated')
  }
})

test('Check Theta import private key', () => {
  const wallet = ThetaGenerateWallet()

  expect(wallet).not.toBeNull()

  if (wallet) {
    expect(ThetaImportPrivateKey(wallet.privateKey)).not.toBeNull()
  } else {
    throw new Error('Theta wallet not generated')
  }
})

test('Check web3 import private key', () => {
  const wallet = GenerateWeb3Wallet()

  expect(wallet).not.toBeNull()

  if (wallet) {
    expect(Web3ImportPrivateKey(wallet.privateKey)).not.toBeNull()
  } else {
    throw new Error('Web3 wallet not generated')
  }
})
