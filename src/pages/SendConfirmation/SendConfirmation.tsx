import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'

// Shared
import SendConfirmShared from '@shared/SendConfirm'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import SuccessDrawer from '@drawers/Success'
import FailDrawer from '@drawers/Fail'
import FeedbackDrawer from '@drawers/Feedback'

// Utils
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { IWallet } from '@utils/wallet'
import { sendRawTransaction, getWeb3TxParams, getXrpTxParams } from '@utils/api'
import { logEvent } from '@utils/amplitude'
import {
  formatUnit,
  createTransaction,
  isEthereumLike,
  getTransactionLink,
} from '@utils/currencies'
import { convertDecimals } from '@utils/currencies/ethereumLike'
import * as theta from '@utils/currencies/theta'
import { getItem } from '@utils/storage'
import { getStats, updateStats, isShowSatismeter } from '@utils/txs'

// Config
import {
  ADDRESS_SEND_CONFIRM,
  ADDRESS_SEND_CONFIRM_CANCEL,
  ADDRESS_SEND_PASSWORD,
  ADDRESS_SEND_PASSWORD_CANCEL,
} from '@config/events'

// Hooks
import useState from '@hooks/useState'

// Types
import { ILocationState, IState } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  activeDrawer: null,
  password: '',
  inputErrorLabel: null,
  transactionLink: '',
  isButtonLoading: false,
  failText: '',
}

const SendConfirmation: React.FC = () => {
  const history = useHistory()

  const {
    state: {
      amount,
      symbol,
      networkFee,
      addressFrom,
      addressTo,
      outputs,
      chain,
      networkFeeSymbol,
      contractAddress = undefined,
      tokenChain = undefined,
      decimals = undefined,
      extraId = undefined,
      name = undefined,
    },
  } = useLocation<ILocationState>()

  const { state, updateState } = useState<IState>(initialState)

  const onConfirmModal = async (): Promise<void> => {
    logEvent({
      name: ADDRESS_SEND_PASSWORD,
    })

    if (state.inputErrorLabel) {
      updateState({ inputErrorLabel: null })
    }

    const backup = getItem('backup')

    if (backup) {
      const decryptBackup = decrypt(backup, state.password)

      if (decryptBackup) {
        const findWallet: IWallet | null = JSON.parse(decryptBackup).wallets.find(
          (wallet: IWallet) => wallet.address === addressFrom
        )

        if (findWallet?.privateKey) {
          updateState({ isButtonLoading: true })

          const parseAmount =
            tokenChain && decimals
              ? convertDecimals(amount, decimals)
              : formatUnit(symbol, amount, 'to', chain, 'ether')
          const parseNetworkFee = formatUnit(symbol, networkFee, 'to', chain, 'ether')

          const ethTxData = isEthereumLike(symbol, tokenChain)
            ? await getWeb3TxParams(
                addressFrom,
                addressTo,
                parseAmount,
                chain || tokenChain,
                contractAddress
              )
            : {}

          const xrpTxData = symbol === 'xrp' ? await getXrpTxParams(addressFrom) : {}

          const transactionData = {
            from: addressFrom,
            to: addressTo,
            amount: parseAmount,
            privateKey: findWallet.privateKey,
            symbol,
            tokenChain,
            outputs,
            networkFee: parseNetworkFee,
            contractAddress,
          }

          if (theta.coins.indexOf(symbol) !== -1) {
            const transaction = await theta.createTransaction(
              symbol,
              addressFrom,
              addressTo,
              amount,
              findWallet.privateKey
            )

            if (transaction) {
              return updateState({
                activeDrawer: 'success',
                transactionLink: theta.getTransactionLink(transaction),
                isButtonLoading: false,
              })
            }
            return updateState({ inputErrorLabel: 'Error while creating transaction' })
          }

          const transaction = await createTransaction({
            ...transactionData,
            ...ethTxData,
            xrpTxData,
            extraId,
          })

          updateState({ isButtonLoading: false })

          if (transaction) {
            const sendTransaction = await sendRawTransaction(transaction, chain || tokenChain)

            if (sendTransaction) {
              return checkTransaction(sendTransaction)
            }
          }

          return updateState({ inputErrorLabel: 'Error while creating transaction' })
        }
      }
    }

    return updateState({ inputErrorLabel: 'Password is not valid' })
  }

  const checkTransaction = async (transaction: any) => {
    if (symbol === 'xrp' && transaction?.engine_result_code === 125) {
      return updateState({
        activeDrawer: 'fail',
        failText:
          'You are sending funds to an inactive address. Due to the Network rules, you must transfer at least 20 XRP to activate it.',
      })
    }

    let txHash = transaction

    if (symbol === 'xrp') {
      if (transaction?.engine_result !== 'tesSUCCESS') {
        return updateState({ inputErrorLabel: 'Error while creating transaction' })
      }
      txHash = transaction?.tx_json?.hash
    }

    return updateState({
      activeDrawer: 'success',
      transactionLink: getTransactionLink(txHash, symbol, chain, tokenChain),
    })
  }

  const onCancel = (): void => {
    logEvent({
      name: ADDRESS_SEND_CONFIRM_CANCEL,
    })

    history.goBack()
  }

  const onConfirm = (): void => {
    logEvent({
      name: ADDRESS_SEND_CONFIRM,
    })

    updateState({ activeDrawer: 'confirm' })
  }

  const onCloseConfirmDrawer = (): void => {
    logEvent({
      name: ADDRESS_SEND_PASSWORD_CANCEL,
    })

    onCloseDrawer()
  }

  const closeSuccessDrawer = (): void => {
    if (state.isButtonLoading) {
      return
    }

    const txsStats = getStats()

    if (txsStats) {
      updateStats()
      const { amount } = JSON.parse(txsStats)

      const isCanShowDrawer = isShowSatismeter(amount + 1)

      if (isCanShowDrawer) {
        return updateState({ activeDrawer: 'feedback' })
      }
    }

    history.replace('/wallets')
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const setPassword = (password: string): void => {
    updateState({ password })
  }

  const onCloseFeedbackDrawer = (): void => {
    history.replace('/wallets')
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack backTitle="Send" onBack={history.goBack} />
        <SendConfirmShared
          amount={amount}
          symbol={symbol}
          networkFee={networkFee}
          addressFrom={addressFrom}
          addressTo={addressTo}
          networkFeeSymbol={networkFeeSymbol}
          tokenChain={tokenChain}
          tokenName={name}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </Styles.Wrapper>
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
        onConfirm={onConfirmModal}
        isButtonLoading={state.isButtonLoading}
      />

      <SuccessDrawer
        isActive={state.activeDrawer === 'success'}
        onClose={closeSuccessDrawer}
        text="Your transaction has been successfully sent. You can check it here:"
        link={state.transactionLink}
      />

      <FailDrawer
        isActive={state.activeDrawer === 'fail'}
        onClose={onCloseDrawer}
        text={state.failText}
      />

      <FeedbackDrawer
        isActive={state.activeDrawer === 'feedback'}
        onClose={onCloseFeedbackDrawer}
      />
    </>
  )
}

export default SendConfirmation
