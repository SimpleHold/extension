import * as React from 'react'
import { render } from 'react-dom'
import numeral from 'numeral'
import { BigNumber } from 'bignumber.js'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Components
import Button from '@components/Button'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import SuccessDrawer from '@drawers/Success'
import FailDrawer from '@drawers/Fail'

// Utils
import { toLower, toUpper } from '@utils/format'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { IWallet } from '@utils/wallet'
import { convertDecimals } from '@utils/web3'
import { formatUnit, createTransaction, isEthereumLike, getTransactionLink } from '@utils/address'
import { sendRawTransaction, getWeb3TxParams, getXrpTxParams } from '@utils/api'
import * as theta from '@utils/currencies/theta'
import { getItem, removeItem } from '@utils/storage'

// Styles
import Styles from './styles'

interface Props {
  amount?: number
  symbol?: string
  addressFrom?: string
  addressTo?: string
  networkFee?: number
  tabInfo?: {
    favIconUrl: string
    url: string
  }
  tokenChain?: string
  decimals?: number
  chain?: string
  contractAddress?: string
  outputs?: UnspentOutput[]
  networkFeeSymbol?: string
  extraId?: string
}

const SendConfirmation: React.FC = () => {
  const [props, setProps] = React.useState<Props>({})
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm' | 'success' | 'fail'>(
    null
  )
  const [password, setPassword] = React.useState<string>('')
  const [inputErrorLabel, setInputErrorLabel] = React.useState<null | string>(null)
  const [isButtonLoading, setButtonLoading] = React.useState<boolean>(false)
  const [transactionLink, setTransactionLink] = React.useState<string>('')
  const [failText, setFailText] = React.useState<string>('')

  React.useEffect(() => {
    checkProps()
  }, [])

  const parseJson = (value: string): { [key: string]: any } | null => {
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  }

  const checkProps = async (): Promise<void> => {
    const data = getItem('sendConfirmationData')

    if (data) {
      const parseData = parseJson(data)

      if (parseData) {
        removeItem('sendConfirmationData')
        return setProps(parseData)
      }
    }

    onClose()
  }

  const onClose = (): void => {
    if (getItem('sendPageProps')) {
      removeItem('sendPageProps')
    }

    window.close()
  }

  const onConfirm = (): void => {
    setActiveDrawer('confirm')
  }

  const onConfirmSend = async (): Promise<void> => {
    if (inputErrorLabel) {
      setInputErrorLabel(null)
    }

    const backup = getItem('backup')

    if (
      backup &&
      props?.amount &&
      props?.symbol &&
      props?.networkFee &&
      props?.addressFrom &&
      props?.addressTo &&
      props?.chain
    ) {
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
      } = props

      const decryptBackup = decrypt(backup, password)

      if (decryptBackup) {
        const findWallet: IWallet | null = JSON.parse(decryptBackup).wallets.find(
          (wallet: IWallet) => toLower(wallet.address) === toLower(props.addressFrom)
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
    const { tokenChain, symbol, chain } = props

    if (symbol && chain) {
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
  }

  return (
    <ExternalPageContainer
      onClose={onClose}
      headerStyle="green"
      backPageTitle="Send"
      backPageUrl="send.html"
    >
      <>
        <Styles.Body>
          <Styles.Row>
            <Styles.Title>Confirm the sending</Styles.Title>
            <Styles.SiteInfo>
              <Styles.SiteInfoLabel>Confirm sending on</Styles.SiteInfoLabel>
              {props?.tabInfo ? (
                <Styles.SiteInfoRow>
                  <Styles.SiteFavicon src={props.tabInfo.favIconUrl} />
                  <Styles.SiteUrl>{props.tabInfo.url}</Styles.SiteUrl>
                </Styles.SiteInfoRow>
              ) : null}
            </Styles.SiteInfo>

            <Styles.OrderCheck>
              <Styles.Table>
                <Styles.Tbody>
                  <Styles.TableTr>
                    <Styles.TableTd>
                      <Styles.TableTitle>Amount:</Styles.TableTitle>
                    </Styles.TableTd>
                    <Styles.TableTd>
                      <Styles.TableAmount>
                        {numeral(props?.amount).format('0.[00000000]')}
                      </Styles.TableAmount>
                    </Styles.TableTd>
                    <Styles.TableTd>
                      <Styles.TableSymbol>{toUpper(props.symbol)}</Styles.TableSymbol>
                    </Styles.TableTd>
                  </Styles.TableTr>
                  <Styles.TableTr>
                    <Styles.TableTd>
                      <Styles.TableTitle>Network fee:</Styles.TableTitle>
                    </Styles.TableTd>
                    <Styles.TableTd>
                      <Styles.TableAmount>
                        {numeral(props?.networkFee).format('0.[00000000]')}
                      </Styles.TableAmount>
                    </Styles.TableTd>
                    <Styles.TableTd>
                      <Styles.TableSymbol>{toUpper(props.symbol)}</Styles.TableSymbol>
                    </Styles.TableTd>
                  </Styles.TableTr>
                </Styles.Tbody>
              </Styles.Table>

              {toUpper(props?.symbol) === toUpper(props?.networkFeeSymbol) ? (
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
                          {props?.amount && props?.networkFee ? (
                            <Styles.TableAmount>
                              {numeral(
                                new BigNumber(props.amount).plus(props.networkFee).toNumber()
                              ).format('0.[00000000]')}
                            </Styles.TableAmount>
                          ) : null}
                        </Styles.TableTd>
                        <Styles.TableTd>
                          <Styles.TableSymbol>{toUpper(props.symbol)}</Styles.TableSymbol>
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
                <Styles.DestinateText>{props?.addressFrom}</Styles.DestinateText>
              </Styles.Destinate>
              <Styles.Destinate>
                <Styles.DestinateTitle>To</Styles.DestinateTitle>
                <Styles.DestinateText>{props?.addressTo}</Styles.DestinateText>
              </Styles.Destinate>
            </Styles.DestinationsList>
          </Styles.Row>
          <Styles.Actions>
            <Button label="Cancel" isSmall isLight onClick={onClose} mr={7.5} />
            <Button label="Confirm" isSmall onClick={onConfirm} ml={7.5} />
          </Styles.Actions>
        </Styles.Body>
        <ConfirmDrawer
          isActive={activeDrawer === 'confirm'}
          onClose={() => setActiveDrawer(null)}
          title="Confirm the sending"
          inputLabel="Enter password"
          textInputType="password"
          textInputValue={password}
          inputErrorLabel={inputErrorLabel}
          onChangeText={setPassword}
          isButtonDisabled={!validatePassword(password)}
          onConfirm={onConfirmSend}
          isButtonLoading={isButtonLoading}
          openFrom="browser"
        />
        <SuccessDrawer
          isActive={activeDrawer === 'success'}
          onClose={onClose}
          text="Your transaction has been successfully sent. You can check it here:"
          link={transactionLink}
          openFrom="browser"
          isCloseOnLinkClick
        />
        <FailDrawer
          isActive={activeDrawer === 'fail'}
          onClose={() => setActiveDrawer(null)}
          text={failText}
        />
      </>
    </ExternalPageContainer>
  )
}

render(<SendConfirmation />, document.getElementById('send-confirmation'))
