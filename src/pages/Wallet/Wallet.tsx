import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { PrivateKey } from '@hashgraph/sdk'

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
import { getWarning } from '@utils/api'
import {
  activateAddress,
  generateWalletName,
  getWalletChain,
  getWalletName,
  getWallets,
  IWallet,
  renameWallet,
  toggleVisibleWallet,
} from '@utils/wallet'
import {
  activateWallet,
  checkWithPhrase,
  getExplorerLink,
  getSingleBalance,
  getTransactionLink,
} from '@utils/currencies'
import { openWebPage } from '@utils/extension'
import { validatePassword } from '@utils/validate'
import { getItem } from '@utils/storage'
import { decrypt } from '@utils/crypto'
import { toLower, toUpper } from '@utils/format'
import { findWalletTxHistory, group as groupTxs } from 'utils/history'
import { logEvent } from '@utils/amplitude'
import { updateTxsHistory } from '@utils/history'
import { receiveAllPendingTxs } from '@utils/currencies/nano'

// Config
import { getCurrency } from '@config/currencies'
import { getSharedToken, getToken } from '@config/tokens'
import { REFRESH_BALANCE } from '@config/events'

// Hooks
import useState from '@hooks/useState'

// Types
import { ILocationState, IState } from './types'

// Styles
import Styles from './styles'
import { TTxWallet } from 'utils/api/types'

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
  address: '',
}

const WalletPage: React.FC = () => {
  const {
    state: locationState,
    state: {
      isRedirect,
      symbol,
      uuid,
      chain,
      contractAddress,
      tokenName,
      hardware,
      isHidden = false,
      name,
      decimals = 0,
    },
  } = useLocation<ILocationState>()
  const history = useHistory()
  const { state, updateState } = useState<IState>({
    ...initialState,
    isHiddenWallet: isHidden,
    address: locationState.address,
  })

  const [walletPendingStatus, setWalletPendingStatus] = React.useState<null | boolean>(null)
  const [pendingBalance, setPendingBalance] = React.useState<null | number>(null)
  const [hasPendingTxs, setHasPendingTxs] = React.useState<null | boolean>(null)

  React.useEffect(() => {
    loadBalance()
    getWalletTxHistory()
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
        (wallet: IWallet) => toLower(wallet.uuid) === toLower(uuid),
      )

      if (findWallet) {
        const walletName =
          findWallet.walletName || generateWalletName(walletsList, symbol, uuid, hardware, chain, name)

        updateState({ walletName })
      }
    }
  }

  const openPage = (url: string, stateData: { [key: string]: any } = {}) => () => {

    const sharedToken = getSharedToken(symbol, chain)
    const walletName = getWalletName({ uuid, symbol, hardware, chain, name, address: state.address })

    history.push(url, {
      ...locationState,
      walletName: state.walletName || walletName,
      tokenChain: chain,
      chain: sharedToken ? chain : currency?.chain,
      currency,
      address: state.address,
      decimals: sharedToken ? sharedToken.decimals : decimals,
      isRedirect: !!isRedirect,
      ...stateData,
    })
  }

  const loadBalance = async (): Promise<void> => {
    if (state.isNotActivated) {
      updateState({ balance: 0, estimated: 0 })
      return
    }

    const { balance, balance_usd, pending } = await getSingleBalance(
      { symbol, address: state.address, chain: currency?.chain || chain, tokenSymbol, contractAddress }
    )

    setPendingBalance(pending || 0)
    updateState({ balance, estimated: balance_usd })
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

  const getWalletTxHistory = async (): Promise<void> => {

    if (state.isNotActivated) {
      return updateState({ txHistory: [] })
    }
    const wallet: TTxWallet = { address: state.address, chain: getWalletChain(symbol, chain), symbol }
    await updateTxsHistory({ pickSingleWallet: wallet })
    const history = findWalletTxHistory(wallet)

    const txHistory = groupTxs(history)

    const pendingTxs = history.find(tx => tx.isPending)
    setHasPendingTxs(!!pendingTxs)

    updateState({ txHistory })
  }

  const onSelectDropdown = (key: string) => {
    if (key === 'recoveryPhrase' || key === 'privateKey') {
      updateState({
        activeDrawer: 'confirm',
        confirmDrawerTitle: `Please enter your password to see the ${
          withPhrase ? 'recovery phrase' : 'private key'
        }`,
        confirmDrawerType: withPhrase ? 'showPhrase' : 'showPrivateKey',
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
        address: state.address,
      })
    }
  }

  const onRefreshBalance = (): void => {
    if (state.isBalanceRefreshing) return
    if (state.balance !== null && state.estimated !== null) {
      updateState({ balance: null, estimated: null, isBalanceRefreshing: true })
      setTimeout(loadBalance, 1000)

      logEvent({
        name: REFRESH_BALANCE,
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
            (wallet: IWallet) => toLower(wallet.uuid) === toLower(uuid),
          )

          if (findWallet) {
            const { privateKey } = findWallet

            if (privateKey) {
              if (symbol.toLowerCase() === 'xno') {
                const res = await receiveAllPendingTxs(state.address, privateKey)
                if (res) {
                  await getWalletTxHistory()
                  setWalletPendingStatus(false)
                  return updateState({
                    isDrawerButtonLoading: false,
                    activeDrawer: 'txsReceivedSuccess',
                    password: '',
                  })
                }
              }
            }
          }
        }
      }

      return updateState({
        passwordErrorLabel: 'Error occurred',
        isDrawerButtonLoading: false,
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
            (wallet: IWallet) => toLower(wallet.uuid) === toLower(uuid),
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
                  address: getAddress,
                })
              }
            }
          }

          return updateState({
            passwordErrorLabel: 'Activation failed',
            isDrawerButtonLoading: false,
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
            (wallet: IWallet) => toLower(wallet.address) === toLower(state.address),
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
      passwordErrorLabel: null,
    })
  }

  const openRenameDrawer = (): void => {
    updateState({ activeDrawer: 'renameWallet' })
  }

  const onRenameWallet = (walletName: string) => (): void => {
    updateState({ activeDrawer: null, walletName })
    renameWallet(uuid, walletName)
  }

  const onDownloadBackup = (): void => {
    return history.replace('/download-backup', {
      password: state.password,
      from: 'newWallet',
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
      confirmDrawerType: 'activateWallet',
    })
  }

  const onConfirmReceivePending = (): void => {
    updateState({
      activeDrawer: 'confirm',
      confirmDrawerTitle: 'Please enter your password to receive incoming transactions',
      confirmDrawerType: 'receivePendingTxs',
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
              getOpenPage={openPage}
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
              isRedirect={isRedirect}
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
