import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import numeral from 'numeral'
import { BigNumber } from 'bignumber.js'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'
import CurrencyLogo from '@components/CurrencyLogo'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import SuccessDrawer from '@drawers/Success'
import FailDrawer from '@drawers/Fail'
import FeedbackDrawer from '@drawers/Feedback'

// Utils
import { toUpper, short } from '@utils/format'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { IWallet } from '@utils/wallet'
import { sendRawTransaction, getWeb3TxParams, getXrpTxParams } from '@utils/api'
import { logEvent } from '@utils/amplitude'
import { formatUnit, createTransaction, isEthereumLike, getTransactionLink } from '@utils/address'
import { convertDecimals } from '@utils/web3'
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

    const transactionLink = getTransactionLink(txHash, symbol, chain, tokenChain)

    if (transactionLink) {
      updateState({ transactionLink })
    }
    return updateState({ activeDrawer: 'success' })
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
      const { amount } = JSON.parse(txsStats)

      updateStats()

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
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Confirm the sending</Styles.Title>
            <Styles.SubTitle>Check transaction details</Styles.SubTitle>

            <Styles.Destinations>
              <Styles.CurrencyLogo>
                <CurrencyLogo size={50} symbol={symbol} chain={tokenChain} />
              </Styles.CurrencyLogo>

              <Styles.Destination>
                <Styles.DestinationType>From</Styles.DestinationType>
                <Styles.DestinationText>{short(addressFrom, 20)}</Styles.DestinationText>
              </Styles.Destination>

              <Styles.Destination>
                <Styles.DestinationType>To</Styles.DestinationType>
                <Styles.DestinationText>{short(addressTo, 20)}</Styles.DestinationText>
              </Styles.Destination>
            </Styles.Destinations>

            <Styles.Order>
              <Styles.Amounts>
                <Styles.Table>
                  <Styles.Tbody>
                    <Styles.TableTr>
                      <Styles.TableTd>
                        <Styles.TableTitle>Amount</Styles.TableTitle>
                      </Styles.TableTd>
                      <Styles.TableTd>
                        <Styles.TableAmount>
                          {numeral(amount).format('0.[00000000]')}
                        </Styles.TableAmount>
                      </Styles.TableTd>
                      <Styles.TableTd>
                        <Styles.TableSymbol>{toUpper(symbol)}</Styles.TableSymbol>
                      </Styles.TableTd>
                    </Styles.TableTr>
                    <Styles.TableTr>
                      <Styles.TableTd>
                        <Styles.TableTitle>Network fee</Styles.TableTitle>
                      </Styles.TableTd>
                      <Styles.TableTd>
                        <Styles.TableAmount>
                          {numeral(networkFee).format('0.[00000000]')}
                        </Styles.TableAmount>
                      </Styles.TableTd>
                      <Styles.TableTd>
                        <Styles.TableSymbol>{toUpper(networkFeeSymbol)}</Styles.TableSymbol>
                      </Styles.TableTd>
                    </Styles.TableTr>
                  </Styles.Tbody>
                </Styles.Table>
              </Styles.Amounts>

              {toUpper(symbol) === toUpper(networkFeeSymbol) ? (
                <>
                  <Styles.Divider>
                    <Styles.DividerCircle />
                    <Styles.DividerLine />
                    <Styles.DividerCircle />
                  </Styles.Divider>

                  <Styles.Total>
                    <Styles.Table>
                      <Styles.Tbody>
                        <Styles.TableTr>
                          <Styles.TableTd>
                            <Styles.TableTotal>Total</Styles.TableTotal>
                          </Styles.TableTd>
                          <Styles.TableTd>
                            <Styles.TableAmount>
                              {numeral(new BigNumber(amount).plus(networkFee).toNumber()).format(
                                '0.[00000000]'
                              )}
                            </Styles.TableAmount>
                          </Styles.TableTd>
                          <Styles.TableTd>
                            <Styles.TableSymbol>{toUpper(symbol)}</Styles.TableSymbol>
                          </Styles.TableTd>
                        </Styles.TableTr>
                      </Styles.Tbody>
                    </Styles.Table>
                  </Styles.Total>
                </>
              ) : null}
            </Styles.Order>
          </Styles.Row>
          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onCancel} mr={7.5} />
            <Button label="Confirm" onClick={onConfirm} ml={7.5} />
          </Styles.Actions>
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
