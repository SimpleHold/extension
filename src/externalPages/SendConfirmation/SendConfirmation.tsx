import * as React from 'react'
import { browser } from 'webextension-polyfill-ts'
import { render } from 'react-dom'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import SuccessDrawer from '@drawers/Success'
import FailDrawer from '@drawers/Fail'
import LedgerDrawer from '@drawers/Ledger'
import BasicDrawer from '@drawers/Basic'
import FeedbackDrawer from '@drawers/Feedback'

// Shared
import SendConfirmShared from '@shared/SendConfirm'

// Utils
import { toLower } from '@utils/format'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { IWallet } from '@utils/wallet'
import { convertDecimals } from '@utils/currencies/ethereumLike'
import {
  formatUnit,
  createTransaction,
  isEthereumLike,
  getTransactionLink,
  checkIsInternalTx,
  createInternalTx,
} from '@utils/currencies'
import { sendRawTransaction, getWeb3TxParams, getXrpTxParams } from '@utils/api'
import { getItem, getJSON, removeItem } from '@utils/storage'
import { ethereumSignTransaction, signTransaction, getFeatures } from '@utils/trezor'
import {
  ethLedgerSignTx,
  requestTransport,
  createXrpTx,
  ILedgerError,
  createBtcTx,
  getFirstAddress,
} from '@utils/ledger'
import { getStats, updateStats, isShowSatismeter } from '@utils/txs'
import { minus } from '@utils/format'

// Hooks
import useState from '@hooks/useState'

// Assets
import errorHardwareConnectIcon from '@assets/drawer/errorHardwareConnect.svg'

// Types
import { IState, TLedgerTxParams } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  props: null,
  activeDrawer: null,
  password: '',
  inputErrorLabel: null,
  isDrawerButtonLoading: false,
  transactionLink: '',
  failText: '',
  isButtonLoading: false,
  ledgerTransport: null,
  ledgerDrawerState: null,
  isDraggable: false,
}

const SendConfirmation: React.FC = () => {
  const { state, updateState } = useState<IState>(initialState)

  React.useEffect(() => {
    checkProps()
    getQueryParams()
  }, [])

  React.useEffect(() => {
    if (state.ledgerDrawerState && !state.activeDrawer) {
      updateState({ activeDrawer: 'ledger' })
    }
  }, [state.ledgerDrawerState, state.activeDrawer])

  React.useEffect(() => {
    if (state.ledgerTransport) {
      createLedgerTx()
    }
  }, [state.ledgerTransport])

  const createLedgerTx = async (): Promise<void> => {
    try {
      if (state.ledgerTransport && state.props && state.props?.hardware) {
        const {
          symbol,
          addressTo,
          amount,
          chain,
          addressFrom,
          hardware: { path },
          outputs,
          networkFee,
          extraId,
        } = state.props

        const parseAmount = formatUnit(symbol, amount, 'to', chain, 'ether')
        const parseNetworkFee = formatUnit(symbol, networkFee, 'to', chain, 'ether')

        updateState({ ledgerDrawerState: 'reviewTx' })

        const request = await signLedgerTx({
          transport: state.ledgerTransport,
          symbol,
          path,
          addressFrom,
          addressTo,
          amount: parseAmount,
          chain,
          fee: parseNetworkFee,
          outputs,
          extraId,
        })

        if (typeof request === 'object' && request !== null) {
          const { name } = request

          if (name === 'TransportStatusError') {
            updateState({ ledgerDrawerState: 'wrongApp' })
          } else if (name === 'DisconnectedDeviceDuringOperation') {
            updateState({ ledgerDrawerState: 'connectionFailed' })
          }
          return
        }

        if (request) {
          const txHash = await sendRawTransaction(request, chain)

          if (txHash) {
            return checkTransaction(txHash)
          }
        }
      }

      updateState({ activeDrawer: 'fail' })
    } catch {
      updateState({ activeDrawer: 'fail' })
    }
  }

  const signLedgerTx = async ({
    transport,
    symbol,
    path,
    addressFrom,
    addressTo,
    amount,
    chain,
    fee,
    outputs,
    extraId,
  }: TLedgerTxParams): Promise<string | null | ILedgerError> => {
    if (symbol === 'eth') {
      const ethParams = await getWeb3TxParams(addressFrom, addressTo, amount, chain)

      if (ethParams) {
        const { nonce, gas, gasPrice, chainId } = ethParams

        return await ethLedgerSignTx(
          transport,
          path,
          gasPrice,
          gas,
          addressTo,
          amount,
          nonce,
          chainId
        )
      }
    } else if (symbol === 'xrp') {
      return await createXrpTx(transport, path, addressFrom, addressTo, amount, extraId)
    } else if (symbol === 'btc' && outputs) {
      return await createBtcTx(transport, path, outputs, addressFrom, addressTo, amount, fee)
    }

    return null
  }

  const getQueryParams = (): void => {
    const searchParams = new URLSearchParams(location.search)

    const queryDraggable = searchParams.get('isDraggable')

    if (queryDraggable === 'true') {
      updateState({ isDraggable: true })
    }
  }

  const checkProps = async (): Promise<void> => {
    const props = getJSON('sendConfirmationData')

    if (props) {
      removeItem('sendConfirmationData')
      updateState({ props })
    } else {
      onClose()
    }
  }

  const onClose = (): void => {
    if (getItem('sendPageProps')) {
      removeItem('sendPageProps')
    }

    browser.runtime.sendMessage({
      type: 'close_select_address_window',
    })

    window.close()
  }

  const onConfirm = (): void => {
    if (state.activeDrawer === 'fail') {
      updateState({ activeDrawer: null })
    }

    if (state.props?.hardware) {
      if (state.props.hardware.type === 'ledger') {
        onConnectLedger()
      } else {
        if (state.activeDrawer === 'wrongDevice') {
          updateState({ activeDrawer: null })
        }

        onSendHardwareTx()
      }
    } else {
      updateState({ activeDrawer: 'confirm' })
    }
  }

  const onConnectLedger = async (): Promise<void> => {
    if (state.ledgerDrawerState) {
      updateState({ activeDrawer: null, ledgerDrawerState: null })
    }

    const transport = await requestTransport()

    if (transport && state.props && state.props?.hardware) {
      const {
        hardware: { deviceId },
      } = state.props

      const getFirstLedgerAddress = await getFirstAddress(transport, state.props.symbol)

      if (typeof getFirstLedgerAddress === 'string') {
        if (toLower(getFirstLedgerAddress) !== toLower(deviceId)) {
          updateState({ ledgerDrawerState: 'wrongDevice' })
        } else {
          updateState({ ledgerTransport: transport })
        }
      } else {
        updateState({ ledgerDrawerState: 'wrongDevice' })
      }
    }
  }

  const onSendHardwareTx = async (): Promise<void> => {
    if (state.props && state.props?.hardware) {
      const {
        symbol,
        addressTo,
        amount,
        chain,
        addressFrom,
        hardware,
        outputs,
        networkFee,
      } = state.props
      const { deviceId, path } = hardware

      const trezorFeatures = await getFeatures()

      updateState({ isButtonLoading: true })

      if (trezorFeatures?.device_id !== deviceId) {
        return updateState({ activeDrawer: 'wrongDevice' })
      }

      const parseAmount = formatUnit(symbol, amount, 'to', chain, 'ether')
      const parseNetworkFee = formatUnit(symbol, networkFee, 'to', chain, 'ether')

      let getTxId

      if (toLower(symbol) === 'eth') {
        const ethParams = await getWeb3TxParams(addressFrom, addressTo, parseAmount, chain)

        if (ethParams) {
          const { chainId, nonce, gas, gasPrice } = ethParams

          getTxId = await ethereumSignTransaction(
            path,
            addressTo,
            parseAmount,
            chainId,
            nonce,
            gas,
            +gasPrice
          )
        }
      } else if (outputs?.length) {
        getTxId = await signTransaction(
          `${parseAmount}`,
          addressTo,
          symbol,
          outputs,
          hardware.path,
          parseNetworkFee
        )
      }

      if (getTxId) {
        return updateState({
          activeDrawer: 'success',
          transactionLink: getTransactionLink(getTxId, symbol, chain),
          isButtonLoading: false,
        })
      }
      return updateState({ activeDrawer: 'fail', isButtonLoading: false })
    }
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })

    if (state.ledgerDrawerState) {
      updateState({ ledgerDrawerState: null })
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

    onClose()
  }

  const onConfirmSend = async (): Promise<void> => {
    if (state.inputErrorLabel) {
      updateState({ inputErrorLabel: null })
    }

    const backup = getItem('backup')

    if (backup && state.props) {
      const {
        tokenChain,
        decimals,
        amount,
        symbol,
        chain,
        networkFee,
        addressFrom,
        addressTo,
        contractAddress,
        outputs,
        extraId,
      } = state.props

      const decryptBackup = decrypt(backup, state.password)

      if (decryptBackup) {
        const findWallet: IWallet | null = JSON.parse(decryptBackup).wallets.find(
          (wallet: IWallet) => toLower(wallet.address) === toLower(state.props?.addressFrom)
        )

        if (findWallet?.privateKey) {
          updateState({ isDrawerButtonLoading: true })

          const parseAmount =
            tokenChain && decimals
              ? convertDecimals(getAmount(), decimals)
              : formatUnit(symbol, getAmount(), 'to', chain, 'ether')
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

          const isInternalTx = checkIsInternalTx(symbol)

          if (isInternalTx) {
            const createTx = await createInternalTx(
              symbol,
              addressFrom,
              addressTo,
              getAmount(),
              findWallet.privateKey
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

          updateState({ isDrawerButtonLoading: false })

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

    return updateState({
      inputErrorLabel: 'Error while creating transaction',
      isButtonLoading: false,
    })
  }

  const onClickLedgerDrawer = (): void => {
    if (state.props?.hardware?.type === 'ledger') {
      onConnectLedger()
    }
  }

  const checkTransaction = async (transaction: any) => {
    if (state.props) {
      const { tokenChain, symbol, chain } = state.props

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
          return updateState({
            inputErrorLabel: 'Error while creating transaction',
            isButtonLoading: false,
          })
        }
        txHash = transaction?.tx_json?.hash
      }

      updateState({
        activeDrawer: 'success',
        transactionLink: getTransactionLink(txHash, symbol, chain, tokenChain),
      })
    }
  }

  const setPassword = (password: string): void => {
    updateState({ password })
  }

  const getAmount = (): number => {
    if (state.props) {
      const { amount, networkFee, isIncludeFee } = state.props

      if (isIncludeFee === 'true') {
        return minus(amount, networkFee)
      }
      return amount
    }
    return 0
  }

  return (
    <ExternalPageContainer
      onClose={onClose}
      headerStyle="green"
      backPageTitle={state.props?.hardware ? undefined : 'Send'}
      backPageUrl={state.props?.hardware ? undefined : 'send.html'}
      isDraggable={state.isDraggable}
    >
      <>
        {state.props ? (
          <Styles.Body>
            <SendConfirmShared
              amount={getAmount()}
              symbol={state.props.symbol}
              networkFee={state.props.networkFee}
              addressFrom={state.props.addressFrom}
              addressTo={state.props.addressTo}
              networkFeeSymbol={state.props.networkFeeSymbol}
              tokenChain={state.props.tokenChain}
              tokenName={state.props.name}
              onCancel={onClose}
              onConfirm={onConfirm}
              isButtonLoading={state.isButtonLoading}
              tabInfo={state.props.tabInfo}
            />
          </Styles.Body>
        ) : null}
        <ConfirmDrawer
          isActive={state.activeDrawer === 'confirm'}
          onClose={onCloseDrawer}
          title="Confirm the sending"
          inputLabel="Enter password"
          textInputType="password"
          textInputValue={state.password}
          inputErrorLabel={state.inputErrorLabel}
          onChangeText={setPassword}
          isButtonDisabled={!validatePassword(state.password)}
          onConfirm={onConfirmSend}
          isButtonLoading={state.isDrawerButtonLoading}
          openFrom="browser"
        />
        <SuccessDrawer
          isActive={state.activeDrawer === 'success'}
          onClose={closeSuccessDrawer}
          text="Your transaction has been successfully sent. You can check it here:"
          link={state.transactionLink}
          openFrom="browser"
          isCloseOnLinkClick
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
          symbol={state.props?.symbol}
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
        <FeedbackDrawer
          isActive={state.activeDrawer === 'feedback'}
          onClose={onClose}
          openFrom="browser"
        />
      </>
    </ExternalPageContainer>
  )
}

render(<SendConfirmation />, document.getElementById('send-confirmation'))
