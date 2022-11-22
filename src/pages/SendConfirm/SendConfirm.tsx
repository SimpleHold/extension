import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'

// Containers
import SendConfirmContainer from '@containers/SendConfirm'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import SuccessDrawer from '@drawers/Success'
import FailDrawer from '@drawers/Fail'
import FeedbackDrawer from '@drawers/Feedback'

// Coins
import { checkIsInternalTx, createInternalTx, createTx, getTransactionLink } from '@coins/index'

// Store
import { useSendStore } from '@store/send/store'

// Utils
import { validatePassword } from '@utils/validate'
import { plus, minusString } from '@utils/bn'
import { isShowSatismeter, logEvent } from '@utils/metrics'
import { getItem } from '@utils/storage'
import { decrypt } from '@utils/crypto'
import { IWallet } from '@utils/wallet'
import { toLower } from '@utils/format'
import { sendRawTransaction } from '@utils/api'
import { getStats, updateStats } from '@utils/history'

// Config
import * as events from '@config/events'
import { initialState, warnings } from './data'

// Hooks
import useState from '@hooks/useState'
import useDebounce from '@hooks/useDebounce'

// Types
import { IState, ILocationState } from './types'

// Styles
import Styles from './styles'

const SendConfirm: React.FC = () => {
  const {
    state: { address, memo, feeEstimated, amount },
  } = useLocation<ILocationState>()
  const history = useHistory()
  const { fee, balance, wallet, currencyInfo, utxos } = useSendStore()

  const { state, updateState } = useState<IState>({
    ...initialState,
    amount,
  })

  const debouncedPassword = useDebounce(state.password, 3000)

  React.useEffect(() => {
    if (debouncedPassword) {
      updateState({ logCaptured: true })

      logEvent({
        name: events.SEND_PASS,
      })
    }
  }, [debouncedPassword])

  React.useEffect(() => {
    checkAmount()
  }, [])

  React.useEffect(() => {
    if (state.inputErrorLabel && state.isButtonLoading) {
      updateState({ isButtonLoading: false })
    }
  }, [state.inputErrorLabel, state.isButtonLoading])

  React.useEffect(() => {
    if (state.activeDrawer === 'success') {
      logEvent({
        name: events.SEND_SUCCESS,
      })
    }
  }, [state.activeDrawer])

  const checkAmount = (): void => {
    if (plus(state.amount, fee) > Number(balance)) {
      updateState({ amount: minusString(balance, fee) })
    }
  }

  const onConfirm = async (): Promise<void> => {
    logEvent({
      name: events.SEND_CONFIRMED,
    })

    updateState({ activeDrawer: 'confirm' })
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

  const onCancel = (): void => {
    logEvent({
      name: events.SEND_CANCEL,
      properties: {
        step: 'send_confirm',
      },
    })

    history.goBack()
  }

  const onConfirmDrawer = async (): Promise<void> => {
    if (!state.logCaptured) {
      logEvent({
        name: events.SEND_PASS,
      })
    }

    if (!wallet || !currencyInfo) {
      return
    }

    logEvent({
      name: events.SEND_CONFIRMED,
    })

    updateState({ inputErrorLabel: null, isButtonLoading: true })

    const backup = getItem('backup')

    if (backup) {
      const decryptBackup = decrypt(backup, state.password)

      if (decryptBackup) {
        const findWallet: IWallet | null = JSON.parse(decryptBackup).wallets.find(
          (item: IWallet) => toLower(item.address) === toLower(wallet?.address)
        )

        if (findWallet) {
          const { privateKey, mnemonic } = findWallet
          const { symbol, chain, decimals, contractAddress } = wallet

          if (checkIsInternalTx(symbol, chain)) {
            const request = await createInternalTx({
              symbol,
              addressFrom: wallet.address,
              addressTo: address,
              amount: state.amount,
              privateKey,
              networkFee: fee,
              outputs: utxos,
              extraId: memo,
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
              addressTo: address,
              amount: state.amount,
              privateKey,
              utxos,
              fee,
              tokenChain: chain,
              contractAddress,
              extraId: memo,
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

  const showWarning = (inputErrorLabel: string): void => {
    updateState({ inputErrorLabel })
  }

  const onCloseConfirmDrawer = (): void => {
    if (!state.isButtonLoading) {
      updateState({ activeDrawer: null })
    }
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

  const onCloseFeedbackDrawer = (): void => {
    history.replace('/wallets')
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Home" whiteLogo />
        <Styles.Container>
          <SendConfirmContainer
            onBack={history.goBack}
            onCancel={onCancel}
            address={address}
            amount={state.amount}
            feeEstimated={feeEstimated}
            onConfirm={onConfirm}
          />
        </Styles.Container>
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
          state.txLink.length ? 'You can check it here:' : ''
        }`}
        link={state.txLink}
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

export default observer(SendConfirm)
