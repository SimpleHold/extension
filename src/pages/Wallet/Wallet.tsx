import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Heading from './components/Heading'
import WalletCard from './components/WalletCard'
import TransactionHistory from './components/TransactionHistory'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import PrivateKeyDrawer from '@drawers/PrivateKey'

// Utils
import { getBalance } from '@utils/api'
import { IWallet, updateBalance } from '@utils/wallet'
import { getTransactionHistory } from '@utils/api'
import { openWebPage } from '@utils/extension'
import { getExplorerLink } from '@utils/address'
import { validatePassword } from '@utils/validate'
import { getItem } from '@utils/storage'
import { decrypt } from '@utils/crypto'
import { toLower } from '@utils/format'

// Config
import { getCurrency, checkWithPhrase } from '@config/currencies'
import { getToken } from '@config/tokens'

// Types
import { TAddressTx } from '@utils/api/types'

// Styles
import Styles from './styles'

interface LocationState {
  name: string
  symbol: string
  address: string
  chain?: string
  contractAddress?: string
  tokenName?: string
  decimals?: number
  isHidden?: boolean
}

const WalletPage: React.FC = () => {
  const {
    state,
    state: {
      name,
      symbol,
      address,
      chain = undefined,
      contractAddress = undefined,
      tokenName = undefined,
      decimals = undefined,
      isHidden = false,
    },
  } = useLocation<LocationState>()
  const history = useHistory()

  const [balance, setBalance] = React.useState<null | number>(null)
  const [estimated, setEstimated] = React.useState<null | number>(null)
  const [txHistory, setTxHistory] = React.useState<TAddressTx[] | null>(null)
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm' | 'privateKey'>(null)
  const [isBalanceRefreshing, setBalanceRefreshing] = React.useState<boolean>(false)
  const [password, setPassword] = React.useState<string>('')
  const [passwordErrorLabel, setPasswordErrorLabel] = React.useState<null | string>(null)
  const [privateKey, setPrivateKey] = React.useState<null | string>(null)

  const currency = chain ? getToken(symbol, chain) : getCurrency(symbol)
  const withPhrase = checkWithPhrase(symbol)

  React.useEffect(() => {
    loadBalance()
    getTxHistory()
  }, [])

  React.useEffect(() => {
    if (balance !== null && estimated !== null && isBalanceRefreshing) {
      setBalanceRefreshing(false)
    }
  }, [balance, estimated, isBalanceRefreshing])

  const loadBalance = async (): Promise<void> => {
    const { balance, balance_usd, balance_btc } = await getBalance(
      address,
      currency?.chain || chain,
      chain ? symbol : undefined,
      contractAddress
    )

    setBalance(balance)
    updateBalance(address, symbol, balance, balance_btc)
    setEstimated(balance_usd)
  }

  const getTxHistory = async (): Promise<void> => {
    if (currency) {
      const data = await getTransactionHistory(currency?.chain, address)

      setTxHistory(data)
    }
  }

  const openPage = (url: string) => () => {
    history.push(url, state)
  }

  const onSelectDropdown = (index: number) => {
    if (index === 0) {
      setActiveDrawer('confirm')
    } else if (index === 1) {
      openWebPage(getExplorerLink(address, symbol, currency, chain, contractAddress))
    } else if (index === 2) {
      history.push('/select-token', {
        currency,
        address,
      })
    }
  }

  const onRefreshBalance = (): void => {
    if (balance !== null && estimated !== null) {
      setBalanceRefreshing(true)
      setBalance(null)
      setEstimated(null)

      loadBalance()
    }
  }

  const onConfirmDrawer = (): void => {
    if (passwordErrorLabel) {
      setPasswordErrorLabel(null)
    }

    if (validatePassword(password)) {
      const backup = getItem('backup')

      if (backup?.length) {
        const decryptBackup = decrypt(backup, password)

        if (decryptBackup) {
          const parseBackup = JSON.parse(decryptBackup)
          const findWallet = parseBackup?.wallets?.find(
            (wallet: IWallet) => toLower(wallet.address) === toLower(address)
          )

          if (findWallet) {
            if (findWallet.mnemonic) {
              setPrivateKey(findWallet.mnemonic)
            } else {
              setPrivateKey(findWallet.privateKey)
            }
            return setActiveDrawer('privateKey')
          }
        }
      }
    }

    return setPasswordErrorLabel('Password is not valid')
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Home" />
        <Styles.Container>
          <Styles.Row>
            <Heading symbol={symbol} withPhrase={withPhrase} onSelectDropdown={onSelectDropdown} />
            <WalletCard
              openPage={openPage}
              symbol={symbol}
              chain={chain}
              balance={balance}
              estimated={estimated}
              onRefreshBalance={onRefreshBalance}
              isBalanceRefreshing={isBalanceRefreshing}
            />
          </Styles.Row>
          <TransactionHistory data={txHistory} symbol={symbol} />
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={activeDrawer === 'confirm'}
        onClose={() => setActiveDrawer(null)}
        title={`Please enter your password to see the ${
          withPhrase ? 'recovery phrase' : 'private key'
        }`}
        isButtonDisabled={!validatePassword(password)}
        onConfirm={onConfirmDrawer}
        textInputValue={password}
        onChangeText={setPassword}
        inputLabel="Enter password"
        textInputType="password"
        inputErrorLabel={passwordErrorLabel}
      />
      <PrivateKeyDrawer
        isMnemonic={withPhrase}
        isActive={activeDrawer === 'privateKey'}
        onClose={() => {
          setActiveDrawer(null)
          setPrivateKey(null)
        }}
        privateKey={privateKey}
      />
    </>
  )
}

export default WalletPage
