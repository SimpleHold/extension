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
  checkIsInternalTx,
  createInternalTx,
} from '@utils/currencies'
import { convertDecimals } from '@utils/currencies/ethereumLike'
import { getItem } from '@utils/storage'
import { getStats, updateStats, isShowSatismeter } from '@utils/txs'
import { minus } from '@utils/format'

// Config
import { TRANSACTION_CANCEL, TRANSACTION_CONFIRM, TRANSACTION_PASSWORD } from '@config/events'

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
      isIncludeFee = false,
      contractAddress = undefined,
      tokenChain = undefined,
      decimals = undefined,
      extraId = undefined,
      tokenName = undefined,
    },
  } = useLocation<ILocationState>()

  const { state, updateState } = useState<IState>(initialState)

  const onConfirmDrawer = async (): Promise<void> => {
    logEvent({
      name: TRANSACTION_PASSWORD,
      properties: {
        symbol,
      },
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
              ? convertDecimals(getAmount(), decimals)
              : formatUnit(symbol, getAmount(), 'to', chain, 'ether')
          const parseNetworkFee = +formatUnit(symbol, networkFee, 'to', chain, 'ether')

          const ethTxData = isEthereumLike(symbol, tokenChain)
            ? await getWeb3TxParams(
              addressFrom,
              addressTo,
              `${parseAmount}`,
              chain || tokenChain,
              contractAddress
            )
            : {}

          const xrpTxData = symbol === 'xrp' ? await getXrpTxParams(addressFrom) : {}

          const transactionData = {
            from: addressFrom,
            to: addressTo,
            amount: `${parseAmount}`,
            privateKey: findWallet.privateKey,
            symbol,
            tokenChain,
            outputs,
            networkFee: parseNetworkFee,
            contractAddress,
          }

          const isInternalTx = checkIsInternalTx(symbol)

          if (isInternalTx) {
            const createTx = await createInternalTx(
              symbol,
              addressFrom,
              addressTo,
              getAmount(),
              findWallet.privateKey,
              parseNetworkFee,
              outputs,
              extraId
            )

            if (createTx) {
              return updateState({
                activeDrawer: 'success',
                transactionLink: getTransactionLink(createTx, symbol, chain, tokenChain),
                isButtonLoading: false,
              })
            }

            return updateState({
              inputErrorLabel: 'Error while creating transaction',
              isButtonLoading: false,
            })
          }
          const transaction = await createTransaction({
            ...transactionData,
            ...ethTxData,
            xrpTxData,
            extraId,
          })
          if (transaction) {
            const sendTransaction = await sendRawTransaction(transaction, chain || tokenChain)
            if (sendTransaction) {
              return checkTransaction(sendTransaction)
            }
          }

          return updateState({
            inputErrorLabel: 'Error while creating transaction',
            isButtonLoading: false,
          })
        }
      }
    }

    return updateState({ inputErrorLabel: 'Password is not valid' })
  }

  const checkTransaction = async (transaction: any) => {
    if (symbol === 'xrp' && transaction?.engine_result_code === 125) {
      return updateState({
        activeDrawer: 'fail',
        isButtonLoading: false,
        failText:
          'You are sending funds to an inactive address. Due to the Network rules, you must transfer at least 20 XRP to activate it.',
      })
    }

    let txHash = transaction

    if (symbol === 'xrp') {
      if (transaction?.engine_result !== 'tesSUCCESS') {
        return updateState({
          inputErrorLabel: 'Error while creating transaction',
          isButtonLoading: false,
        })
      }
      txHash = transaction?.tx_json?.hash
    }

    return updateState({
      activeDrawer: 'success',
      transactionLink: getTransactionLink(txHash, symbol, chain, tokenChain),
      isButtonLoading: false,
    })
  }

  const onCancel = (): void => {
    logEvent({
      name: TRANSACTION_CANCEL,
      properties: {
        stage: 'confirm',
      },
    })

    history.goBack()
  }

  const onConfirm = (): void => {
    logEvent({
      name: TRANSACTION_CONFIRM,
      properties: {
        stage: 'confirmation',
      },
    })

    updateState({ activeDrawer: 'confirm' })
  }

  const onCloseConfirmDrawer = (): void => {
    logEvent({
      name: TRANSACTION_CANCEL,
      properties: {
        stage: 'password',
      },
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

      const isCanShowDrawer = isShowSatismeter(amount, amount + 1)

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

  const getAmount = (): number => {
    if (isIncludeFee && !tokenChain && (symbol === networkFeeSymbol)) {
      return minus(amount, networkFee)
    }
    return amount
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack backTitle="Send" onBack={history.goBack} />
        <Styles.Body>
          <SendConfirmShared
            amount={getAmount()}
            symbol={symbol}
            networkFee={networkFee}
            addressFrom={addressFrom}
            addressTo={addressTo}
            networkFeeSymbol={networkFeeSymbol}
            tokenChain={tokenChain}
            tokenName={tokenName}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        </Styles.Body>
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
        onConfirm={onConfirmDrawer}
        isButtonLoading={state.isButtonLoading}
      />

      <SuccessDrawer
        isActive={state.activeDrawer === 'success'}
        onClose={closeSuccessDrawer}
        text={`Your transaction has been successfully sent. ${
          state.transactionLink.length ? 'You can check it here:' : ''
        }`}
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
