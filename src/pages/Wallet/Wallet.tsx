import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Heading from './components/Heading'
import WalletCard from './components/WalletCard'
import TransactionHistory from './components/TransactionHistory'
import Warning from '@components/Warning'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import PrivateKeyDrawer from '@drawers/PrivateKey'
import RenameWalletDrawer from '@drawers/RenameWallet'

// Utils
import { getBalance, getTxsInfo } from '@utils/api'
import {
  IWallet,
  updateBalance,
  renameWallet,
  toggleVisibleWallet,
  getWalletName,
  getWallets,
} from '@utils/wallet'
import { getTransactionHistory } from '@utils/api'
import { openWebPage } from '@utils/extension'
import { getExplorerLink, getTransactionLink, checkWithPhrase } from '@utils/currencies'
import { validatePassword } from '@utils/validate'
import { getItem } from '@utils/storage'
import { decrypt } from '@utils/crypto'
import { toLower } from '@utils/format'
import {
  save as saveTxs,
  group as groupTxs,
  compare as compareTxs,
  getExist as getExistTxs,
} from '@utils/txs'
import { logEvent } from '@utils/amplitude'

// Config
import { getCurrency } from '@config/currencies'
import { getToken } from '@config/tokens'
import { ADDRESS_RECEIVE_SEND } from '@config/events'

// Hooks
import useState from '@hooks/useState'

// Types
import { ILocationState, IState } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  balance: null,
  estimated: null,
  txHistory: null,
  activeDrawer: null,
  isBalanceRefreshing: false,
  password: '',
  passwordErrorLabel: null,
  privateKey: null,
  walletName: '',
  isHiddenWallet: false,
}

const WalletPage: React.FC = () => {
  const {
    state: locationState,
    state: {
      symbol,
      address,
      uuid,
      chain,
      contractAddress,
      tokenName,
      hardware,
      isHidden = false,
      name,
    },
  } = useLocation<ILocationState>()
  const history = useHistory()

  const { state, updateState } = useState<IState>({
    ...initialState,
    isHiddenWallet: isHidden,
  })

  React.useEffect(() => {
    loadBalance()
    getTxHistory()
    getName()
  }, [])

  React.useEffect(() => {
    if (state.balance !== null && state.estimated !== null && state.isBalanceRefreshing) {
      updateState({ isBalanceRefreshing: false })
    }
  }, [state.balance, state.estimated, state.isBalanceRefreshing])

  const currency = chain ? getToken(symbol, chain) : getCurrency(symbol)
  const withPhrase = checkWithPhrase(symbol)
  const tokenSymbol = chain ? symbol : undefined

  const getName = (): void => {
    const walletsList = getWallets()

    if (walletsList) {
      const findWallet = walletsList.find(
        (wallet: IWallet) => toLower(wallet.uuid) === toLower(uuid)
      )

      if (findWallet) {
        const walletName =
          findWallet.walletName || getWalletName(walletsList, symbol, uuid, hardware, chain, name)

        updateState({ walletName })
      }
    }
  }

  const loadBalance = async (): Promise<void> => {
    const { balance, balance_usd, balance_btc } = await getBalance(
      address,
      currency?.chain || chain,
      tokenSymbol,
      contractAddress
    )

    updateState({ balance, estimated: balance_usd })
    updateBalance(address, symbol, balance, balance_btc)
  }

  const getTxHistory = async (): Promise<void> => {
    if (currency) {
      const data = await getTransactionHistory(
        currency.chain,
        address,
        tokenSymbol,
        contractAddress
      )

      if (data.length) {
        const compare = compareTxs(address, currency.chain, data, tokenSymbol, contractAddress)

        if (compare.length) {
          const getFullTxHistoryInfo = await getTxsInfo(currency.chain, address, compare)
          saveTxs(address, currency.chain, getFullTxHistoryInfo, tokenSymbol, contractAddress)
        }

        const txHistory = groupTxs(
          getExistTxs(address, currency.chain, tokenSymbol, contractAddress)
        )
        updateState({ txHistory })
      } else {
        updateState({ txHistory: [] })
      }
    }
  }

  const openPage = (url: string) => () => {
    if (url === '/send') {
      logEvent({
        name: ADDRESS_RECEIVE_SEND,
      })
    }

    history.push(url, {
      ...locationState,
      walletName: state.walletName,
      tokenChain: chain,
      chain: currency?.chain,
      currency,
    })
  }

  const onSelectDropdown = (key: string) => {
    if (key === 'recoveryPhrase' || key === 'privateKey') {
      updateState({ activeDrawer: 'confirm' })
    } else if (key === 'explorer' && currency) {
      openWebPage(getExplorerLink(address, symbol, currency.chain, chain, contractAddress))
    } else if (key === 'availability') {
      toggleVisibleWallet(address, symbol, !state.isHiddenWallet)
      updateState({ isHiddenWallet: !state.isHiddenWallet })
    } else if (key === 'addToken') {
      history.push('/select-token', {
        currency,
        address,
      })
    }
  }

  const onRefreshBalance = (): void => {
    if (state.balance !== null && state.estimated !== null) {
      updateState({ balance: null, estimated: null, isBalanceRefreshing: true })
      loadBalance()
    }
  }

  const onConfirmDrawer = (): void => {
    if (state.passwordErrorLabel) {
      updateState({ passwordErrorLabel: null })
    }

    if (validatePassword(state.password)) {
      const backup = getItem('backup')

      if (backup?.length) {
        const decryptBackup = decrypt(backup, state.password)

        if (decryptBackup) {
          const parseBackup = JSON.parse(decryptBackup)
          const findWallet: IWallet | undefined = parseBackup?.wallets?.find(
            (wallet: IWallet) => toLower(wallet.address) === toLower(address)
          )

          if (findWallet) {
            if (findWallet.mnemonic) {
              updateState({ privateKey: findWallet.mnemonic })
            } else if (findWallet.privateKey) {
              updateState({ privateKey: findWallet.privateKey })
            }
            return updateState({ activeDrawer: 'privateKey' })
          }
        }
      }
    }

    return updateState({ passwordErrorLabel: 'Password is not valid' })
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const openRenameDrawer = (): void => {
    updateState({ activeDrawer: 'renameWallet' })
  }

  const onRenameWallet = (walletName: string) => (): void => {
    updateState({ activeDrawer: null, walletName })
    renameWallet(uuid, walletName)
  }

  const openTx = (hash: string) => async (): Promise<void> => {
    if (currency) {
      await openWebPage(getTransactionLink(hash, symbol, currency.chain, chain))
    }
  }

  const onClosePKDrawer = (): void => {
    updateState({ activeDrawer: null, privateKey: null })
  }

  const setPassword = (password: string): void => {
    updateState({ password })
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Home" />
        <Styles.Container>
          <Styles.Row>
            <Heading
              symbol={symbol}
              withPhrase={withPhrase}
              onSelectDropdown={onSelectDropdown}
              walletName={state.walletName}
              onRenameWallet={openRenameDrawer}
              hardware={hardware}
              isHidden={state.isHiddenWallet}
            />
            <WalletCard
              openPage={openPage}
              symbol={symbol}
              chain={chain}
              balance={state.balance}
              estimated={state.estimated}
              onRefreshBalance={onRefreshBalance}
              isBalanceRefreshing={state.isBalanceRefreshing}
              address={address}
              tokenName={tokenName}
            />
            {state.balance !== null && state.balance < 20 && toLower(symbol) === 'xrp' ? (
              <Warning
                text="You need 20 XRP minimum to activate your XRP address."
                color="#7D7E8D"
                br={8}
                mt={10}
                padding="8px 10px"
                background="rgba(189, 196, 212, 0.2)"
              />
            ) : null}
          </Styles.Row>
          <TransactionHistory data={state.txHistory} symbol={symbol} openTx={openTx} />
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={state.activeDrawer === 'confirm'}
        onClose={onCloseDrawer}
        title={`Please enter your password to see the ${
          withPhrase ? 'recovery phrase' : 'private key'
        }`}
        isButtonDisabled={!validatePassword(state.password)}
        onConfirm={onConfirmDrawer}
        textInputValue={state.password}
        onChangeText={setPassword}
        inputLabel="Enter password"
        textInputType="password"
        inputErrorLabel={state.passwordErrorLabel}
      />
      <PrivateKeyDrawer
        isMnemonic={withPhrase}
        isActive={state.activeDrawer === 'privateKey'}
        onClose={onClosePKDrawer}
        privateKey={state.privateKey}
      />
      <RenameWalletDrawer
        isActive={state.activeDrawer === 'renameWallet'}
        onClose={onCloseDrawer}
        onRename={onRenameWallet}
      />
    </>
  )
}

export default WalletPage
