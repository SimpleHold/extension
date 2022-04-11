import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { PrivateKey } from '@hashgraph/sdk'
import { useIdleTimer } from 'react-idle-timer'

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
import SuccessDrawer from '@drawers/Success'

// Utils
import {
  getTxsInfo,
  getWarning,
  getTransactionHistory
} from '@utils/api'
import {
  updateBalance,
  renameWallet,
  toggleVisibleWallet,
  getWalletName,
  getWallets,
  activateAddress, getWalletChain
} from '@utils/wallet'
import { activateWallet, getBalance } from '@utils/currencies'
import { openWebPage } from '@utils/extension'
import { getExplorerLink, getTransactionLink, checkWithPhrase } from '@utils/currencies'
import { validatePassword } from '@utils/validate'
import { getItem } from '@utils/storage'
import { decrypt } from '@utils/crypto'
import { toLower, toUpper } from '@utils/format'
import {
  save as saveTxs,
  group as groupTxs,
  compare as compareTxs,
  getExist as getExistTxs
} from '@utils/txs'
import { logEvent } from '@utils/amplitude'
import { getTxHistory as getTonCoinTxHistory } from '@utils/currencies/toncoin'
import { checkIfTimePassed, toMs } from '@utils/dates'
import { removeTempTxs, updateTxsHistory } from '@utils/history'
import { receiveAllPendingTxs } from '@utils/currencies/nano'

// Config
import { getCurrency } from '@config/currencies'
import { getSharedToken, getToken } from '@config/tokens'
import { ADDRESS_ACTION } from '@config/events'

// Hooks
import useState from '@hooks/useState'

// Types
import { ILocationState, IState } from './types'
import { IWallet } from '@utils/wallet'

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
  warning: null,
  confirmDrawerTitle: '',
  confirmDrawerType: null,
  isDrawerButtonLoading: false,
  isNotActivated: false,
  address: ''
}

const WalletPage: React.FC = () => {
  const {
    state: locationState,
    state: {
      symbol,
      uuid,
      chain,
      contractAddress,
      tokenName,
      hardware,
      isHidden = false,
      name,
      decimals = 0
    }
  } = useLocation<ILocationState>()
  const history = useHistory()
  const { state, updateState } = useState<IState>({
    ...initialState,
    isHiddenWallet: isHidden,
    address: locationState.address
  })

  const [walletPendingStatus, setWalletPendingStatus] = React.useState<null | boolean>(null)
  const [pendingBalance, setPendingBalance] = React.useState<null | number>(null)
  const [hasPendingTxs, setHasPendingTxs] = React.useState<null | boolean>(null)
  const [lastRefreshHistoryTimestamp, setRefreshHistoryTimestamp] = React.useState(0)
  const [isIdle, setIsIdle] = React.useState(false)

  useIdleTimer({
    timeout: toMs({ minutes: 1 }),
    onActive: () => setIsIdle(false),
    onIdle: () => setIsIdle(true)
  })

  React.useEffect(() => {
    loadBalance()
    getTxHistory()
    getName()
    getWalletWarning()
    getWalletData()
  }, [])

  React.useEffect(() => {
    if (state.balance !== null && state.estimated !== null && state.isBalanceRefreshing) {
      updateState({ isBalanceRefreshing: false })
    }
  }, [state.balance, state.estimated, state.isBalanceRefreshing])

  React.useEffect(() => {
    setWalletPendingStatus(Boolean(hasPendingTxs || pendingBalance))
  }, [pendingBalance, hasPendingTxs])

  React.useEffect(() => {
    let id: number
    if (walletPendingStatus) {
      const isReady = checkIfTimePassed(lastRefreshHistoryTimestamp, { seconds: 15 })
      id = +setInterval(() => {
        if (isReady) {
          getTxHistory().then(loadBalance)
        }
      }, toMs({ seconds: isIdle ? 60 : 15 }))
    }
    return () => clearInterval(id)
  }, [isIdle, walletPendingStatus])

  const getWalletData = (): void => {
    const currentWallet = getCurrentWallet()

    if (currentWallet?.isNotActivated) {
      updateState({ isNotActivated: true })
    }

    if (currentWallet?.address?.length) {
      updateState({ address: currentWallet.address })
    }
  }

  const getWalletWarning = async () => {
    const warning = await getWarning(symbol, chain)

    if (warning) {
      updateState({ warning })
    }
  }

  const currency = chain ? getToken(symbol, chain) : getCurrency(symbol)
  const withPhrase = checkWithPhrase(symbol)
  const tokenSymbol = chain ? symbol : undefined
  const isCustomToken =
    !currency && chain !== undefined && contractAddress !== undefined && decimals > 0

  const getCurrentWallet = (): IWallet | undefined => {
    const walletsList = getWallets()

    if (walletsList) {
      return walletsList.find((wallet: IWallet) => toLower(wallet.uuid) === toLower(uuid))
    }

    return undefined
  }

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
    if (state.isNotActivated) {
      updateState({ balance: 0, estimated: 0 })
      return
    }

    const { balance, balance_usd, balance_btc, pending } = await getBalance(
      symbol,
      state.address,
      currency?.chain || chain,
      tokenSymbol,
      contractAddress
    )

    setPendingBalance(pending)
    updateState({ balance, estimated: balance_usd })
    updateBalance({ address: state.address, symbol, balance, balance_btc, balance_usd, pending })
  }

  const getTonTxHistory = async (): Promise<void> => {
    const txHistory = await getTonCoinTxHistory(state.address)

    updateState({ txHistory })
  }

  const getCurrencyChain = (): string | null => {
    const sharedToken = getSharedToken(symbol, chain)

    if (sharedToken) {
      return sharedToken.chain
    }

    if (isCustomToken && chain) {
      return chain
    }

    if (currency) {
      return currency.chain
    }

    return null
  }

  const getTxHistory = async (): Promise<void> => {

    if (state.isNotActivated) {
      return updateState({ txHistory: [] })
    }

    if (currency?.symbol === 'toncoin' && !chain) {
      return await getTonTxHistory()
    }

    const currencyChain = getCurrencyChain()

    if (currencyChain) {
      const walletData = {
        chain: getWalletChain(symbol, chain),
        address: state.address,
        symbol,
        tokenSymbol,
        contractAddress
      }

      removeTempTxs(walletData)

      const data = await getTransactionHistory(
        currencyChain,
        state.address,
        tokenSymbol,
        contractAddress
      )

      if (data.length) {
        const compare = compareTxs(state.address, currencyChain, data, tokenSymbol, contractAddress)
        if (compare.length) {
          const getFullTxHistoryInfo = await getTxsInfo(currencyChain, state.address, compare)

          saveTxs(state.address, currencyChain, getFullTxHistoryInfo, tokenSymbol, contractAddress)
          updateTxsHistory({ updateSingleWallet: walletData })
        }
      }
      const history = getExistTxs(state.address, currencyChain, tokenSymbol, contractAddress)

      const txHistory = groupTxs(history)

      const pendingTxs = history.find(tx => tx.isPending)
      setHasPendingTxs(!!pendingTxs)

      setRefreshHistoryTimestamp(Date.now())

      updateState({ txHistory })
    } else {
      updateState({ txHistory: [] })
    }
  }

  const openPage = (url: string) => () => {
    logEvent({
      name: ADDRESS_ACTION,
      properties: {
        addressAction: url === '/send' ? 'send' : 'receive'
      }
    })

    const sharedToken = getSharedToken(symbol, chain)

    history.push(url, {
      ...locationState,
      walletName: state.walletName,
      tokenChain: chain,
      chain: sharedToken ? chain : currency?.chain,
      currency,
      address: state.address,
      decimals: sharedToken ? sharedToken.decimals : decimals
    })
  }

  const onSelectDropdown = (key: string) => {
    if (key === 'recoveryPhrase' || key === 'privateKey') {
      updateState({
        activeDrawer: 'confirm',
        confirmDrawerTitle: `Please enter your password to see the ${
          withPhrase ? 'recovery phrase' : 'private key'
        }`,
        confirmDrawerType: withPhrase ? 'showPhrase' : 'showPrivateKey'
      })
    } else if (key === 'explorer') {
      const currencyChain = getCurrencyChain()

      if (currencyChain) {
        openWebPage(getExplorerLink(state.address, symbol, currencyChain, chain, contractAddress))
      }
    } else if (key === 'availability') {
      toggleVisibleWallet(state.address, symbol, !state.isHiddenWallet)
      updateState({ isHiddenWallet: !state.isHiddenWallet })
    } else if (key === 'addToken') {
      history.push('/select-token', {
        currency,
        address: state.address
      })
    }
  }

  const onRefreshBalance = (): void => {
    if (state.isBalanceRefreshing) return
    if (state.balance !== null && state.estimated !== null) {
      updateState({ balance: null, estimated: null, isBalanceRefreshing: true })
      setTimeout(loadBalance, 1000)

      if (walletPendingStatus) {
        const isReady = checkIfTimePassed(lastRefreshHistoryTimestamp, { seconds: 15 })
        isReady && getTxHistory()
      }

      logEvent({
        name: ADDRESS_ACTION,
        properties: {
          addressAction: 'refreshBalance'
        }
      })
    }
  }

  const onReceivePendingTxs = async (): Promise<void> => {
    updateState({ isDrawerButtonLoading: true })

    if (validatePassword(state.password)) {
      const backup = getItem('backup')

      if (backup?.length) {
        const decryptBackup = decrypt(backup, state.password)

        if (decryptBackup) {
          const parseBackup = JSON.parse(decryptBackup)

          const findWallet: IWallet | undefined = parseBackup?.wallets?.find(
            (wallet: IWallet) => toLower(wallet.uuid) === toLower(uuid)
          )

          if (findWallet) {
            const { privateKey } = findWallet

            if (privateKey) {
              if (symbol.toLowerCase() === 'xno') {
                const res = await receiveAllPendingTxs(state.address, privateKey)
                if (res) {
                  await getTxHistory()
                  setWalletPendingStatus(false)
                  return updateState({
                    isDrawerButtonLoading: false,
                    activeDrawer: 'txsReceivedSuccess',
                    password: ''
                  })
                }
              }
            }
          }
        }
      }

      return updateState({
        passwordErrorLabel: 'Error occurred',
        isDrawerButtonLoading: false
      })
    }
    updateState({ passwordErrorLabel: 'Password is not valid', isDrawerButtonLoading: false })
  }


  const onActivateWallet = async (): Promise<void> => {
    updateState({ isDrawerButtonLoading: true })

    if (validatePassword(state.password)) {
      const backup = getItem('backup')

      if (backup?.length) {
        const decryptBackup = decrypt(backup, state.password)

        if (decryptBackup) {
          const parseBackup = JSON.parse(decryptBackup)

          const findWallet: IWallet | undefined = parseBackup?.wallets?.find(
            (wallet: IWallet) => toLower(wallet.uuid) === toLower(uuid)
          )

          if (findWallet) {
            const { privateKey } = findWallet
            let getPubKey: string | null

            try {
              getPubKey = PrivateKey.fromString(`${privateKey}`).publicKey.toString()
            } catch {
              getPubKey = null
            }

            if (getPubKey) {
              const parsedChain = symbol === 'hbar' ? 'hedera' : 'xno'
              const getAddress = await activateWallet(parsedChain, getPubKey, privateKey)
              if (getAddress) {
                activateAddress(uuid, getAddress, decryptBackup, state.password)

                return updateState({
                  isDrawerButtonLoading: false,
                  isNotActivated: false,
                  activeDrawer: 'success',
                  password: '',
                  address: getAddress
                })
              }
            }
          }

          return updateState({
            passwordErrorLabel: 'Activation failed',
            isDrawerButtonLoading: false
          })
        }
      }
    }

    updateState({ passwordErrorLabel: 'Password is not valid', isDrawerButtonLoading: false })
  }

  const onConfirmDrawer = async (): Promise<void> => {
    if (state.confirmDrawerType === 'activateWallet') {
      return await onActivateWallet()
    }
    if (state.confirmDrawerType === 'receivePendingTxs') {
      return await onReceivePendingTxs()
    }
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
            (wallet: IWallet) => toLower(wallet.address) === toLower(state.address)
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
    updateState({
      activeDrawer: null,
      isDrawerButtonLoading: false,
      password: '',
      passwordErrorLabel: null
    })
  }

  const openRenameDrawer = (): void => {
    updateState({ activeDrawer: 'renameWallet' })
  }

  const onRenameWallet = (walletName: string) => (): void => {
    updateState({ activeDrawer: null, walletName })
    renameWallet(uuid, walletName)

    logEvent({
      name: ADDRESS_ACTION,
      properties: {
        addressAction: 'renameWallet'
      }
    })
  }

  const onDownloadBackup = (): void => {
    return history.replace('/download-backup', {
      password: state.password,
      from: 'newWallet'
    })
  }

  const openTx = (hash: string, disabled?: boolean) => async (): Promise<void> => {
    if (disabled) {
      return
    }

    const currencyChain = getCurrencyChain()

    if (currencyChain) {
      await openWebPage(getTransactionLink(hash, symbol, currencyChain, chain))
    }
  }

  const onClosePKDrawer = (): void => {
    updateState({ activeDrawer: null, privateKey: null })
  }

  const setPassword = (password: string): void => {
    updateState({ password })
  }

  const onConfirmActivate = (): void => {
    updateState({
      activeDrawer: 'confirm',
      confirmDrawerTitle: 'Please enter your password to activate your account',
      confirmDrawerType: 'activateWallet'
    })
  }

  const onConfirmReceivePending = (): void => {
    updateState({
      activeDrawer: 'confirm',
      confirmDrawerTitle: 'Please enter your password to receive incoming transactions',
      confirmDrawerType: 'receivePendingTxs'
    })
  }

  const hasUnreceivedTxs = Boolean(symbol.toLowerCase() === 'xno' && walletPendingStatus)
  const onConfirmReceivePendingTxs = hasUnreceivedTxs ? onConfirmReceivePending : undefined

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle='Home' whiteLogo />
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
              address={state.address}
              tokenName={tokenName}
              isNotActivated={state.isNotActivated}
              onConfirmActivate={onConfirmActivate}
              hasUnreceivedTxs={hasUnreceivedTxs}
              onConfirmReceivePending={onConfirmReceivePendingTxs}
            />
            {state.balance !== null && state.balance < 20 && toLower(symbol) === 'xrp' ? (
              <Warning
                text='You need at least 20 XRP to activate your XRP address. This amount is reserved according to the network’s requirement, it can not be sent to another address'
                color='#7D7E8D'
                br={8}
                mt={10}
                padding='8px 10px'
                background='rgba(189, 196, 212, 0.2)'
              />
            ) : null}
            {state.warning ? (
              <Warning
                text={state.warning}
                color='#EB5757'
                br={8}
                mt={10}
                padding='8px 10px'
                background='#FCE6E6'
              />
            ) : null}
            {state.isNotActivated ? (
              <Warning
                text={`You need to activate your ${toUpper(symbol)} address.`}
                color='#7D7E8D'
                br={8}
                mt={10}
                padding='8px 10px'
                background='rgba(189, 196, 212, 0.2)'
              />
            ) : null}
          </Styles.Row>
          <TransactionHistory data={state.txHistory} symbol={symbol} openTx={openTx} />
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={state.activeDrawer === 'confirm'}
        onClose={onCloseDrawer}
        title={state.confirmDrawerTitle}
        isButtonDisabled={!validatePassword(state.password)}
        isButtonLoading={state.isDrawerButtonLoading}
        onConfirm={onConfirmDrawer}
        textInputValue={state.password}
        onChangeText={setPassword}
        inputLabel='Enter password'
        textInputType='password'
        inputErrorLabel={state.passwordErrorLabel}
      />
      <SuccessDrawer
        isActive={state.activeDrawer === 'success'}
        onClose={onDownloadBackup}
        text='The new address has been successfully activated!'
      />
      <SuccessDrawer
        isActive={state.activeDrawer === 'txsReceivedSuccess'}
        onClose={onCloseDrawer}
        text='All incoming transactions have been received!'
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
