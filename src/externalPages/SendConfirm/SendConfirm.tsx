import * as React from 'react'
import { render } from 'react-dom'
import browser from 'webextension-polyfill'
import { observer } from 'mobx-react-lite'

// Components
import Button from '@components/Button'

// Containers
import ExternalPageContainer from '@containers/ExternalPage'
import SendConfirmContainer from '@containers/SendConfirm'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import SuccessDrawer from '@drawers/Success'
import FailDrawer from '@drawers/Fail'
import LedgerDrawer from '@drawers/Ledger'
import BasicDrawer from '@drawers/Basic'

// Coins
import { checkIsInternalTx, createInternalTx, createTx, getTransactionLink } from '@coins/index'

// Utils
import { getItem, removeItem } from '@utils/storage'
import { validatePassword } from '@utils/validate'
import { getWallets, IWallet } from '@utils/wallet'
import { toLower } from '@utils/format'
import { getEstimated } from '@utils/api'
import { plus, minusString } from '@utils/bn'
import { decrypt } from '@utils/crypto'
import { sendRawTransaction } from '@utils/api'

// Store
import { useSendStore } from '@store/send/store'

// Hooks
import useState from '@hooks/useState'

// Config
import { initialState, warnings } from './data'

// Assets
import errorHardwareConnectIcon from '@assets/drawer/errorHardwareConnect.svg'

// Types
import { IState } from './types'

// Styles
import Styles from './styles'

const SendConfirm: React.FC = () => {
  const { state, updateState } = useState<IState>(initialState)
  const {
    setAmount,
    setWallet,
    feeSymbol,
    fee,
    balance,
    wallet,
    setStoreData,
    currencyInfo,
    utxos,
  } = useSendStore()

  React.useEffect(() => {
    getStorageData()
    getQueryParams()
  }, [])

  React.useEffect(() => {
    if (state.storeData) {
      setStoreData(state.storeData)
      getFeeEstimated()
    }
  }, [state.storeData])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event

      if (key === 'Escape' || key === 'Esc') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  React.useEffect(() => {
    if (state.backgroundProps) {
      getWalletsList()
      updateLocalState()
    }
  }, [state.backgroundProps])

  React.useEffect(() => {
    if (state.amount) {
      checkAmount()
      setAmount(state.amount)
    }
  }, [state.amount])

  React.useEffect(() => {
    if (state.inputErrorLabel && state.isButtonLoading) {
      updateState({ isButtonLoading: false })
    }
  }, [state.inputErrorLabel, state.isButtonLoading])

  const checkAmount = (): void => {
    if (plus(state.amount, fee) > Number(balance)) {
      updateState({ amount: minusString(balance, fee) })
    }
  }

  const getFeeEstimated = async (): Promise<void> => {
    const feeEstimated = await getEstimated(1, feeSymbol, 'usd')

    updateState({ feeEstimated })
  }

  const updateLocalState = (): void => {
    if (state.backgroundProps) {
      const { amount, recipientAddress, extraId } = state.backgroundProps

      updateState({
        address: recipientAddress || '',
        memo: extraId || '',
        amount,
      })
    }
  }

  const getWalletsList = (): void => {
    const wallets = getWallets()

    let currency: undefined | string = undefined
    let chain: undefined | string = undefined

    const { backgroundProps } = state

    if (backgroundProps) {
      if (backgroundProps?.currency) {
        currency = backgroundProps.currency
      }

      if (backgroundProps?.chain) {
        chain = backgroundProps.chain
      }
    }

    if (wallets?.length && currency) {
      const filterWallets = wallets.filter(
        (wallet: IWallet) =>
          toLower(wallet.symbol) === toLower(currency) && toLower(wallet.chain) === toLower(chain)
      )

      if (filterWallets.length) {
        setWallet(filterWallets[0])
      }
    }
  }

  const getStorageData = async (): Promise<void> => {
    const backgroundProps = getItem('backgroundProps')
    const storeProps = getItem('storeProps')

    if (backgroundProps) {
      updateState({
        backgroundProps: JSON.parse(backgroundProps),
      })
    }

    if (storeProps) {
      updateState({
        storeData: JSON.parse(storeProps),
      })
    }
  }

  const onClose = (): void => {
    if (getItem('sendConfirmationData')) {
      removeItem('sendConfirmationData')
    }

    browser.runtime.sendMessage({
      type: 'close_select_address_window',
    })
  }

  const getQueryParams = (): void => {
    const searchParams = new URLSearchParams(location.search)

    const queryDraggable = searchParams.get('isDraggable')

    if (queryDraggable === 'true') {
      updateState({ isDraggable: true })
    }
  }

  const onConfirm = (): void => {
    updateState({ activeDrawer: 'confirm' })
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const onCloseConfirmDrawer = (): void => {
    if (!state.isButtonLoading) {
      updateState({ activeDrawer: null })
    }
  }

  const setPassword = (password: string): void => {
    updateState({ password })
  }

  const checkTransaction = (transaction: any): void => {
    let txHash: string | null = null

    if (transaction === null && wallet?.symbol === 'xlm' && +state.amount < 1.0001) {
      return updateState({
        activeDrawer: 'fail',
        isButtonLoading: false,
        failText: warnings.xlm,
      })
    }

    if (wallet?.symbol === 'xrp') {
      if (transaction?.engine_result_code === 125) {
        return updateState({
          activeDrawer: 'fail',
          isButtonLoading: false,
          failText: warnings.xrp,
        })
      }

      if (transaction?.engine_result === 'tesSUCCESS') {
        txHash = transaction?.tx_json?.hash
      }
    } else {
      txHash = transaction
    }

    if (txHash !== null && currencyInfo) {
      return updateState({
        activeDrawer: 'success',
        txLink:
          getTransactionLink(txHash, currencyInfo.chain, currencyInfo.symbol, wallet?.chain) || '',
        isButtonLoading: false,
      })
    } else {
      showWarning('Error while creating transaction')
    }
  }

  const showWarning = (inputErrorLabel: string): void => {
    updateState({ inputErrorLabel })
  }

  const onConfirmDrawer = async (): Promise<void> => {
    if (!wallet || !currencyInfo) {
      return
    }

    updateState({ inputErrorLabel: null, isButtonLoading: true })

    const backup = getItem('backup')

    if (backup) {
      const decryptBackup = decrypt(backup, state.password)

      if (decryptBackup && state.backgroundProps) {
        const findWallet: IWallet | null = JSON.parse(decryptBackup).wallets.find(
          (item: IWallet) => toLower(item.address) === toLower(wallet?.address)
        )

        if (findWallet) {
          const { privateKey, mnemonic } = findWallet
          const { symbol, chain, decimals, contractAddress } = wallet
          const { recipientAddress, extraId } = state.backgroundProps

          if (checkIsInternalTx(symbol, chain)) {
            const request = await createInternalTx({
              symbol,
              addressFrom: wallet.address,
              addressTo: recipientAddress || '',
              amount: state.amount,
              privateKey,
              networkFee: fee,
              outputs: utxos,
              extraId: extraId || '',
              mnemonic,
              tokenChain: chain,
              contractAddress,
              decimals,
              chain: currencyInfo.chain,
            })

            return checkTransaction(request)
          } else {
            const transaction = await createTx({
              symbol,
              chain: currencyInfo.chain,
              addressFrom: wallet.address,
              addressTo: recipientAddress || '',
              amount: state.amount,
              privateKey,
              utxos,
              fee,
              tokenChain: chain,
              contractAddress,
              extraId: extraId || '',
              decimals,
              mnemonic,
            })

            if (transaction) {
              const sendTransaction = await sendRawTransaction(transaction, currencyInfo.chain)

              return checkTransaction(sendTransaction)
            }

            return checkTransaction(null)
          }
        }
      }
    }

    return showWarning('Password is not valid')
  }

  const onClickLedgerDrawer = (): void => {
    // if (state.props?.hardware?.type === 'ledger') {
    //   onConnectLedger()
    // }
  }

  return (
    <ExternalPageContainer onClose={onClose} headerStyle="green" isDraggable={state.isDraggable}>
      <>
        <Styles.Container>
          <Styles.Row>
            <SendConfirmContainer
              onBack={onClose}
              onCancel={onClose}
              onConfirm={onConfirm}
              address={state.address}
              feeEstimated={state.feeEstimated}
              amount={state.amount}
              openFrom="browser"
            />
          </Styles.Row>
          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onClose} mr={7.5} />
            <Button
              label="Confirm"
              onClick={onConfirm}
              ml={7.5}
              isLoading={state.isButtonLoading}
            />
          </Styles.Actions>
        </Styles.Container>
        <ConfirmDrawer
          isActive={state.activeDrawer === 'confirm'}
          onClose={onCloseConfirmDrawer}
          title="Confirm the sending"
          inputLabel="Enter password"
          textInputType="password"
          textInputValue={state.password}
          inputErrorLabel={state.inputErrorLabel}
          onChangeText={setPassword}
          isButtonDisabled={!validatePassword(state.password)}
          onConfirm={onConfirmDrawer}
          isButtonLoading={state.isButtonLoading}
          openFrom="browser"
        />
        <SuccessDrawer
          isActive={state.activeDrawer === 'success'}
          onClose={onClose}
          text={`Your transaction has been successfully sent. ${
            state.txLink.length ? 'You can check it here:' : ''
          }`}
          link={state.txLink}
          openFrom="browser"
        />
        <FailDrawer
          isActive={state.activeDrawer === 'fail'}
          onClose={onCloseDrawer}
          text={state.failText}
          openFrom="browser"
        />
        <LedgerDrawer
          isActive={state.activeDrawer === 'ledger'}
          onClose={onCloseDrawer}
          openFrom="browser"
          state={state.ledgerDrawerState}
          buttonOnClick={onClickLedgerDrawer}
          symbol={wallet?.symbol}
        />
        <BasicDrawer
          isActive={state.activeDrawer === 'wrongDevice'}
          onClose={onCloseDrawer}
          openFrom="browser"
          title="Wrong device"
          text="Connected Trezor is wrong. Please connect the correct device to confirm the transaction."
          icon={errorHardwareConnectIcon}
          button={{
            label: 'Try again',
            onClick: onConfirm,
          }}
        />
      </>
    </ExternalPageContainer>
  )
}

const SendConfirmObserver = observer(SendConfirm)

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
  render(<SendConfirmObserver />, document.getElementById('send-confirm'))
})
