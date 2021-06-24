import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import numeral from 'numeral'
import { BigNumber } from 'bignumber.js'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import SuccessDrawer from '@drawers/Success'
import FailDrawer from '@drawers/Fail'

// Utils
import { toUpper } from '@utils/format'
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

// Config
import {
  ADDRESS_SEND_CONFIRM,
  ADDRESS_SEND_CONFIRM_CANCEL,
  ADDRESS_SEND_PASSWORD,
  ADDRESS_SEND_PASSWORD_CANCEL,
} from '@config/events'

// Styles
import Styles from './styles'

interface LocationState {
  amount: number
  symbol: TSymbols
  networkFee: number
  addressFrom: string
  addressTo: string
  outputs: UnspentOutput[]
  chain: string
  networkFeeSymbol: string
  contractAddress?: string
  tokenChain?: string
  decimals?: number
  extraId?: string
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
  } = useLocation<LocationState>()

  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm' | 'success' | 'fail'>(
    null
  )
  const [password, setPassword] = React.useState<string>('')
  const [inputErrorLabel, setInputErrorLabel] = React.useState<null | string>(null)
  const [transactionLink, setTransactionLink] = React.useState<string>('')
  const [isButtonLoading, setButtonLoading] = React.useState<boolean>(false)
  const [failText, setFailText] = React.useState<string>('')

  const onConfirmModal = async (): Promise<void> => {
    logEvent({
      name: ADDRESS_SEND_PASSWORD,
    })

    if (inputErrorLabel) {
      setInputErrorLabel(null)
    }

    const backup = getItem('backup')

    if (backup) {
      const decryptBackup = decrypt(backup, password)

      if (decryptBackup) {
        const findWallet: IWallet | null = JSON.parse(decryptBackup).wallets.find(
          (wallet: IWallet) => wallet.address === addressFrom
        )

        if (findWallet?.privateKey) {
          setButtonLoading(true)

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
              setTransactionLink(theta.getTransactionLink(transaction))
              setButtonLoading(false)
              return setActiveDrawer('success')
            }
            return setInputErrorLabel('Error while creating transaction')
          }

          const transaction = await createTransaction({
            ...transactionData,
            ...ethTxData,
            xrpTxData,
            extraId,
          })

          setButtonLoading(false)

          if (transaction) {
            const sendTransaction = await sendRawTransaction(transaction, chain || tokenChain)

            if (sendTransaction) {
              return checkTransaction(sendTransaction)
            }
          }

          return setInputErrorLabel('Error while creating transaction')
        }
      }
    }

    return setInputErrorLabel('Password is not valid')
  }

  const checkTransaction = async (transaction: any) => {
    if (symbol === 'xrp' && transaction?.engine_result_code === 125) {
      setFailText(
        'You are sending funds to an inactive address. Due to the Network rules, you must transfer at least 20 XRP to activate it.'
      )
      return setActiveDrawer('fail')
    }

    let txHash = transaction

    if (symbol === 'xrp') {
      if (transaction?.engine_result !== 'tesSUCCESS') {
        return setInputErrorLabel('Error while creating transaction')
      }
      txHash = transaction?.tx_json?.hash
    }

    const link = getTransactionLink(txHash, symbol, chain, tokenChain)

    if (link) {
      setTransactionLink(link)
    }
    return setActiveDrawer('success')
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

    setActiveDrawer('confirm')
  }

  const onCloseConfirmModal = (): void => {
    logEvent({
      name: ADDRESS_SEND_PASSWORD_CANCEL,
    })

    setActiveDrawer(null)
  }

  const closeSuccessDrawer = (): void => {
    if (isButtonLoading) {
      return
    }

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
            <Styles.Description>Check transaction details</Styles.Description>

            <Styles.OrderCheck>
              <Styles.Table>
                <Styles.Tbody>
                  <Styles.TableTr>
                    <Styles.TableTd>
                      <Styles.TableTitle>Amount:</Styles.TableTitle>
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
                      <Styles.TableTitle>Network fee:</Styles.TableTitle>
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

              {toUpper(symbol) === toUpper(networkFeeSymbol) ? (
                <>
                  <Styles.DashedDivider>
                    <Styles.DashedDividerLine />
                  </Styles.DashedDivider>

                  <Styles.Table>
                    <Styles.Tbody>
                      <Styles.TableTr>
                        <Styles.TableTd>
                          <Styles.TableTitle>Total:</Styles.TableTitle>
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
                </>
              ) : null}
            </Styles.OrderCheck>

            <Styles.DestinationsList>
              <Styles.Destinate>
                <Styles.DestinateTitle>From</Styles.DestinateTitle>
                <Styles.DestinateText>{addressFrom}</Styles.DestinateText>
              </Styles.Destinate>
              <Styles.Destinate>
                <Styles.DestinateTitle>To</Styles.DestinateTitle>
                <Styles.DestinateText>{addressTo}</Styles.DestinateText>
              </Styles.Destinate>
            </Styles.DestinationsList>
          </Styles.Row>
          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onCancel} mr={7.5} />
            <Button label="Confirm" onClick={onConfirm} ml={7.5} />
          </Styles.Actions>
        </Styles.Container>
      </Styles.Wrapper>

      <ConfirmDrawer
        isActive={activeDrawer === 'confirm'}
        onClose={onCloseConfirmModal}
        title="Confirm the sending"
        inputLabel="Enter password"
        textInputType="password"
        textInputValue={password}
        inputErrorLabel={inputErrorLabel}
        onChangeText={setPassword}
        isButtonDisabled={!validatePassword(password)}
        onConfirm={onConfirmModal}
        isButtonLoading={isButtonLoading}
      />

      <SuccessDrawer
        isActive={activeDrawer === 'success'}
        onClose={closeSuccessDrawer}
        text="Your transaction has been successfully sent. You can check it here:"
        link={transactionLink}
      />

      <FailDrawer
        isActive={activeDrawer === 'fail'}
        onClose={() => setActiveDrawer(null)}
        text={failText}
      />
    </>
  )
}

export default SendConfirmation
