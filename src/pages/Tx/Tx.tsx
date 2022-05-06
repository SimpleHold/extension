import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'
import dayjs from 'dayjs'
import copy from 'copy-to-clipboard'
import numeral from 'numeral'

// Components
import Header from '@components/Header'
import Cover from '@components/Cover'
import Button from '@components/Button'
import CurrencyLogo from '@components/CurrencyLogo'
import Skeleton from '@components/Skeleton'
import CopyToClipboard from '@components/CopyToClipboard'

// Drawers
import TxAddressesDrawer from '@drawers/TxAddresses'

// Assets
import linkIcon from '@assets/icons/link.svg'
import copyIcon from '@assets/icons/copy.svg'
import checkCopyIcon from '@assets/icons/checkCopy.svg'
import clockIcon from '@assets/icons/clock.svg'

// Utils
import { short, toUpper, getFormatEstimated, price } from '@utils/format'
import { getTransactionLink, getNetworkFeeSymbol } from '@utils/currencies'
import { openWebPage } from '@utils/extension'
import { getHistoryTxInfo } from '@utils/api'

// Hooks
import useState from '@hooks/useState'

// Types
import { IState, ILocationState } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  txInfo: null,
  isCopied: false,
  isLoadingError: false,
  activeDrawer: null,
  activeDrawerTabKey: 'senders',
  feeSymbol: '',
}

const TxHistory: React.FC = () => {
  const history = useHistory()
  const {
    state: { hash, address, symbol, chain, tokenChain, tokenSymbol, contractAddress },
  } = useLocation<ILocationState>()

  const { state, updateState } = useState({ ...initialState, feeSymbol: symbol })

  React.useEffect(() => {
    getTxInfo()
    getFeeSymbol()
  }, [])

  React.useEffect(() => {
    if (state.isCopied) {
      setTimeout(() => {
        updateState({ isCopied: false })
      }, 1000)
    }
  }, [state.isCopied])

  const getFeeSymbol = (): void => {
    updateState({ feeSymbol: getNetworkFeeSymbol(symbol, chain) })
  }

  const getTxInfo = async (): Promise<void> => {
    if (state.isLoadingError) {
      updateState({ isLoadingError: false })
    }

    const txInfo = await getHistoryTxInfo(hash, chain, address, tokenSymbol, contractAddress)

    if (txInfo) {
      updateState({ txInfo })
    } else {
      updateState({ isLoadingError: true })
    }
  }

  const onViewTx = (): void => {
    openWebPage(getTransactionLink(hash, symbol, chain, tokenChain))
  }

  const onCopyHash = (): void => {
    copy(hash)
    updateState({ isCopied: true })
  }

  const onClickButton = (): void => {
    if (state.isLoadingError) {
      getTxInfo()
    } else {
      onViewTx()
    }
  }

  const onViewAddresses = (activeDrawerTabKey: 'senders' | 'recipients') => (): void => {
    updateState({ activeDrawer: 'txAddresses', activeDrawerTabKey })
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack backTitle="History" onBack={history.goBack} whiteLogo />
        <Styles.Container>
          <Styles.Body>
            {state.isLoadingError ? (
              <Styles.ErrorBlock>
                <Styles.ErrorLoadingIcon />
                <Styles.ErrorLoadingText>
                  Failed to load transaction info. Please try again
                </Styles.ErrorLoadingText>
              </Styles.ErrorBlock>
            ) : (
              <>
                <Styles.Heading>
                  <Skeleton width={50} height={50} br={16} type="gray" isLoading={!state.txInfo}>
                    <CurrencyLogo size={50} symbol={symbol} chain={tokenChain} />
                  </Skeleton>
                  <Styles.HeadingInfo>
                    <Skeleton width={160} height={27} br={5} type="gray" isLoading={!state.txInfo}>
                      {state.txInfo ? (
                        <Styles.AmountRow>
                          <Styles.Amount amount={state.txInfo.amount}>{`${
                            state.txInfo.amount > 0 ? '+' : ''
                          } ${numeral(state.txInfo.amount).format('0.[000000]')} ${toUpper(
                            symbol
                          )}`}</Styles.Amount>
                          {state.txInfo.isPending ? (
                            <Styles.PendingIcon>
                              <SVG src={clockIcon} width={16} height={16} />
                            </Styles.PendingIcon>
                          ) : null}
                        </Styles.AmountRow>
                      ) : null}
                    </Skeleton>
                    <Skeleton
                      width={50}
                      height={19}
                      br={5}
                      mt={4}
                      type="gray"
                      isLoading={!state.txInfo}
                    >
                      {state.txInfo ? (
                        <Styles.Estimated>
                          {`$ ${state.txInfo.estimated > 0 ? '+' : ''} ${getFormatEstimated(
                            state.txInfo.estimated,
                            price(state.txInfo.estimated)
                          )}`}
                        </Styles.Estimated>
                      ) : null}
                    </Skeleton>
                  </Styles.HeadingInfo>
                </Styles.Heading>

                <Styles.Info>
                  <Styles.InfoColumn>
                    <Styles.InfoColumnRow>
                      <Styles.InfoLabel>Fee</Styles.InfoLabel>
                      <Styles.InfoContent>
                        <Skeleton
                          width={100}
                          height={19}
                          br={5}
                          type="gray"
                          isLoading={!state.txInfo}
                        >
                          <Styles.InfoBold>
                            {state.txInfo?.fee} {toUpper(state.feeSymbol)}
                          </Styles.InfoBold>
                        </Skeleton>
                        <Skeleton
                          width={50}
                          height={16}
                          br={5}
                          mt={5}
                          type="gray"
                          isLoading={!state.txInfo}
                        >
                          {state.txInfo ? (
                            <Styles.InfoText>
                              {`$ ${getFormatEstimated(
                                state.txInfo.feeEstimated,
                                price(state.txInfo.feeEstimated)
                              )}`}
                            </Styles.InfoText>
                          ) : null}
                        </Skeleton>
                      </Styles.InfoContent>
                    </Styles.InfoColumnRow>
                  </Styles.InfoColumn>
                  <Styles.InfoColumn>
                    <Styles.InfoColumnRow pb={7}>
                      <Styles.InfoLabel>From</Styles.InfoLabel>
                      <Styles.InfoContent>
                        <Skeleton
                          width={200}
                          height={19}
                          br={5}
                          type="gray"
                          isLoading={!state.txInfo}
                        >
                          {state.txInfo ? (
                            <>
                              {state.txInfo?.addressFrom ? (
                                <CopyToClipboard value={state.txInfo.addressFrom} zIndex={3}>
                                  <Styles.InfoBold>
                                    {short(state.txInfo.addressFrom, 20)}
                                  </Styles.InfoBold>
                                </CopyToClipboard>
                              ) : null}
                              {state.txInfo?.addressesFrom ? (
                                <Styles.AddressesRow onClick={onViewAddresses('senders')}>
                                  <Styles.Addresses>
                                    Senders {state.txInfo.addressesFrom.length}
                                  </Styles.Addresses>
                                  <SVG
                                    src="../../../assets/icons/dropdownArrow.svg"
                                    width={8}
                                    height={6}
                                  />
                                </Styles.AddressesRow>
                              ) : null}
                            </>
                          ) : null}
                        </Skeleton>
                      </Styles.InfoContent>
                    </Styles.InfoColumnRow>
                    <Styles.InfoColumnRow pt={7}>
                      <Styles.InfoLabel>To</Styles.InfoLabel>
                      <Styles.InfoContent>
                        <Skeleton
                          width={200}
                          height={19}
                          br={5}
                          type="gray"
                          isLoading={!state.txInfo}
                        >
                          {state.txInfo ? (
                            <>
                              {state.txInfo?.addressTo ? (
                                <CopyToClipboard value={state.txInfo.addressTo}>
                                  <Styles.InfoBold>
                                    {short(state.txInfo.addressTo, 20)}
                                  </Styles.InfoBold>
                                </CopyToClipboard>
                              ) : null}
                              {state.txInfo?.addressesTo ? (
                                <Styles.AddressesRow onClick={onViewAddresses('recipients')}>
                                  <Styles.Addresses>
                                    Recipients {state.txInfo.addressesTo.length}
                                  </Styles.Addresses>
                                  <SVG
                                    src="../../../assets/icons/dropdownArrow.svg"
                                    width={8}
                                    height={6}
                                  />
                                </Styles.AddressesRow>
                              ) : null}
                            </>
                          ) : null}
                        </Skeleton>
                      </Styles.InfoContent>
                    </Styles.InfoColumnRow>
                  </Styles.InfoColumn>
                  <Styles.InfoColumn>
                    <Styles.InfoColumnRow>
                      <Styles.InfoLabel>Created</Styles.InfoLabel>
                      <Styles.InfoContent>
                        <Skeleton
                          width={100}
                          height={19}
                          br={5}
                          type="gray"
                          isLoading={!state.txInfo}
                        >
                          <Styles.Date>
                            {dayjs(state.txInfo?.date).format('MMM D, HH:mm:ss')}
                          </Styles.Date>
                        </Skeleton>
                      </Styles.InfoContent>
                    </Styles.InfoColumnRow>
                  </Styles.InfoColumn>
                </Styles.Info>
              </>
            )}
            <Styles.HashBlock>
              <Styles.HashBlockRow>
                <Styles.Label>Transaction hash</Styles.Label>
                <Styles.Text>{short(hash, 25)}</Styles.Text>
              </Styles.HashBlockRow>
              <Styles.CopyButton onClick={onCopyHash}>
                <SVG
                  src={state.isCopied ? checkCopyIcon : copyIcon}
                  width={12}
                  height={state.isCopied ? 11 : 12}
                />
              </Styles.CopyButton>
            </Styles.HashBlock>
          </Styles.Body>
          {state.isLoadingError || state.txInfo ? (
            <Button
              label={state.isLoadingError ? 'Try again' : 'View on explorer'}
              onClick={onClickButton}
              icon={state.isLoadingError ? undefined : linkIcon}
            />
          ) : null}
        </Styles.Container>
      </Styles.Wrapper>
      {state.txInfo?.addressesFrom && state.txInfo?.addressesTo ? (
        <TxAddressesDrawer
          isActive={state.activeDrawer === 'txAddresses'}
          onClose={onCloseDrawer}
          addressesFrom={state.txInfo.addressesFrom}
          addressesTo={state.txInfo.addressesTo}
          symbol={symbol}
          activeDrawerTabKey={state.activeDrawerTabKey}
        />
      ) : null}
    </>
  )
}

export default TxHistory
