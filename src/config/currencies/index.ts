// Config
import BITCOIN_LIKE_CURRENCIES from '@config/currencies/bitcoinLike'
import ETHEREUM_LIKE_CURRENCIES from '@config/currencies/ethereumLike'
import ALL_CURRENCIES from '@config/currencies/currencies'
import COSMOS_LIKE_CURRENCIES from '@config/currencies/cosmosLike'
import POLKADOT_LIKE_CURRENCIES from '@config/currencies/polkadotLike'

// Types
import { TCurrency } from './types'

const currencies: TCurrency[] = [
  ...BITCOIN_LIKE_CURRENCIES,
  ...ETHEREUM_LIKE_CURRENCIES,
  ...ALL_CURRENCIES,
  ...COSMOS_LIKE_CURRENCIES,
  ...POLKADOT_LIKE_CURRENCIES,
]

export default currencies
