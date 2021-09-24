import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
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

// Utils
import { getBalance, getTxsInfo, getWarning, activateAccount } from '@utils/api'
import {
  IWallet,
  updateBalance,
  renameWallet,
  toggleVisibleWallet,
  getWalletName,
  getWallets,
  activateAddress,
} from '@utils/wallet'
import { getTransactionHistory } from '@utils/api'
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
  getExist as getExistTxs,
} from '@utils/txs'
import { logEvent } from '@utils/amplitude'

// Config
import { getCurrency } from '@config/currencies'
import { getToken } from '@config/tokens'
import { ADDRESS_ACTION } from '@config/events'

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
    state: { symbol, uuid, chain, contractAddress, tokenName, hardware, isHidden = false, name },
  } = useLocation<ILocationState>()
  const history = useHistory()

  const { state, updateState } = useState<IState>({
    ...initialState,
    isHiddenWallet: isHidden,
    address: locationState.address,
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

    const { balance, balance_usd, balance_btc } = await getBalance(
      state.address,
      currency?.chain || chain,
      tokenSymbol,
      contractAddress
    )

    updateState({ balance, estimated: balance_usd })
    updateBalance(state.address, symbol, balance, balance_btc)
  }

  const getTxHistory = async (): Promise<void> => {
    if (state.isNotActivated) {
      return updateState({ txHistory: [] })
    }

    if (currency) {
      const data = await getTransactionHistory(
        currency.chain,
        state.address,
        tokenSymbol,
        contractAddress
      )

      if (data.length) {
        const compare = compareTxs(
          state.address,
          currency.chain,
          data,
          tokenSymbol,
          contractAddress
        )

        if (compare.length) {
          const getFullTxHistoryInfo = await getTxsInfo(currency.chain, state.address, compare)
          saveTxs(state.address, currency.chain, getFullTxHistoryInfo, tokenSymbol, contractAddress)
        }
      }

      const txHistory = groupTxs(
        getExistTxs(state.address, currency.chain, tokenSymbol, contractAddress)
      )

      updateState({ txHistory })
    }
  }

  const openPage = (url: string) => () => {
    logEvent({
      name: ADDRESS_ACTION,
      properties: {
        addressAction: url === '/send' ? 'send' : 'receive',
      },
    })

    history.push(url, {
      ...locationState,
      walletName: state.walletName,
      tokenChain: chain,
      chain: currency?.chain,
      currency,
      address: state.address,
    })
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
    } else if (key === 'explorer' && currency) {
      openWebPage(getExplorerLink(state.address, symbol, currency.chain, chain, contractAddress))
    } else if (key === 'availability') {
      toggleVisibleWallet(state.address, symbol, !state.isHiddenWallet)
      updateState({ isHiddenWallet: !state.isHiddenWallet })
    } else if (key === 'addToken') {
      history.push('/select-token', {
        currency,
        address: state.address,
      })
    } else if (key === 'viewNft') {
      history.push('/nft-collection', {
        currency,
        address: state.address,
      })
    }
  }

  const onRefreshBalance = (): void => {
    if (state.balance !== null && state.estimated !== null) {
      updateState({ balance: null, estimated: null, isBalanceRefreshing: true })
      loadBalance()

      logEvent({
        name: ADDRESS_ACTION,
        properties: {
          addressAction: 'refreshBalance',
        },
      })
    }
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
            let getPubKey: string | null = null

            try {
              getPubKey = PrivateKey.fromString(`${privateKey}`).publicKey.toString()
            } catch {
              getPubKey = null
            }

            if (getPubKey) {
              const getAddress = await activateAccount('hedera', getPubKey)

              if (getAddress) {
                activateAddress(uuid, getAddress, decryptBackup, state.password)

                return updateState({
                  isDrawerButtonLoading: false,
                  isNotActivated: false,
                  activeDrawer: null,
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
      passwordErrorLabel: null,
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
        addressAction: 'renameWallet',
      },
    })
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

  const onConfirmActivate = (): void => {
    updateState({
      activeDrawer: 'confirm',
      confirmDrawerTitle: 'Please enter your password to activate your account',
      confirmDrawerType: 'activateWallet',
    })
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
              address={state.address}
              tokenName={tokenName}
              isNotActivated={state.isNotActivated}
              onConfirmActivate={onConfirmActivate}
            />
            {state.balance !== null && state.balance < 20 && toLower(symbol) === 'xrp' ? (
              <Warning
                text="You need at least 20 XRP to activate your XRP address. This amount is reserved according to the network’s requirement, it can not be sent to another address"
                color="#7D7E8D"
                br={8}
                mt={10}
                padding="8px 10px"
                background="rgba(189, 196, 212, 0.2)"
              />
            ) : null}
            {state.warning ? (
              <Warning
                text={state.warning}
                color="#EB5757"
                br={8}
                mt={10}
                padding="8px 10px"
                background="#FCE6E6"
              />
            ) : null}
            {state.isNotActivated ? (
              <Warning
                text={`You need activate your ${toUpper(symbol)} address.`}
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
        title={state.confirmDrawerTitle}
        isButtonDisabled={!validatePassword(state.password)}
        isButtonLoading={state.isDrawerButtonLoading}
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
