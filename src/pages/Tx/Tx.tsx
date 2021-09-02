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

// Utils
import { short, toUpper, formatEstimated, price } from '@utils/format'
import { getTransactionLink } from '@utils/currencies'
import { openWebPage } from '@utils/extension'
import { getHistoryTxInfo } from '@utils/api'

// Types
import { THistoryTx } from '@utils/api/types'

// Styles
import Styles from './styles'

interface ILocationState {
  hash: string
  symbol: string
  chain: string
}

const TxHistory: React.FC = () => {
  const history = useHistory()
  const {
    state: { hash, symbol, chain },
  } = useLocation<ILocationState>()

  const [txInfo, setTxInfo] = React.useState<THistoryTx | null>(null)
  const [isCopied, setIsCopied] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)
  const [activeDrawer, setActiveDrawer] = React.useState<'txAddresses' | null>(null)

  React.useEffect(() => {
    getTxInfo()
  }, [])

  React.useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }, [isCopied])

  const getTxInfo = async (): Promise<void> => {
    if (isError) {
      setIsError(false)
    }

    const data = await getHistoryTxInfo(hash, chain)

    if (data) {
      setTxInfo(data)
    } else {
      setIsError(true)
    }
  }

  const onViewTx = (): void => {
    openWebPage(getTransactionLink(hash, symbol, chain))
  }

  const onCopyHash = (): void => {
    copy(hash)
    setIsCopied(true)
  }

  const onClickButton = (): void => {
    if (isError) {
      getTxInfo()
    } else {
      onViewTx()
    }
  }

  const onViewAddresses = (): void => {
    setActiveDrawer('txAddresses')
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack backTitle="History" onBack={history.goBack} />
        <Styles.Container>
          <Styles.Body>
            {isError ? (
              <Styles.ErrorBlock>
                <Styles.ErrorLoadingIcon />
                <Styles.ErrorLoadingText>
                  Failed to load transaction info. Plase try again
                </Styles.ErrorLoadingText>
              </Styles.ErrorBlock>
            ) : (
              <>
                <Styles.Heading>
                  <Skeleton width={50} height={50} br={16} type="gray" isLoading={!txInfo}>
                    <CurrencyLogo size={50} symbol={symbol} />
                  </Skeleton>
                  <Styles.HeadingInfo>
                    <Skeleton width={160} height={27} br={5} type="gray" isLoading={!txInfo}>
                      {txInfo ? (
                        <Styles.Amount>{`${numeral(txInfo.amount).format('0.[000000]')} ${toUpper(
                          symbol
                        )}`}</Styles.Amount>
                      ) : null}
                    </Skeleton>
                    <Skeleton width={50} height={19} br={5} mt={4} type="gray" isLoading={!txInfo}>
                      {txInfo ? (
                        <Styles.Estimated>
                          {`$ ${formatEstimated(txInfo.estimated, price(txInfo.estimated))}`}
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
                        <Skeleton width={100} height={19} br={5} type="gray" isLoading={!txInfo}>
                          <Styles.InfoBold>
                            {txInfo?.fee} {toUpper(symbol)}
                          </Styles.InfoBold>
                        </Skeleton>
                        <Skeleton
                          width={50}
                          height={16}
                          br={5}
                          mt={5}
                          type="gray"
                          isLoading={!txInfo}
                        >
                          {txInfo ? (
                            <Styles.InfoText>
                              {`$ ${formatEstimated(
                                txInfo.feeEstimated,
                                price(txInfo.feeEstimated)
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
                        <Skeleton width={200} height={19} br={5} type="gray" isLoading={!txInfo}>
                          {txInfo ? (
                            <>
                              {txInfo?.addressFrom ? (
                                <CopyToClipboard value={txInfo.addressFrom} zIndex={3}>
                                  <Styles.InfoBold>{short(txInfo.addressFrom, 20)}</Styles.InfoBold>
                                </CopyToClipboard>
                              ) : null}
                              {txInfo?.addressesFrom ? (
                                <Styles.AddressesRow onClick={onViewAddresses}>
                                  <Styles.Addresses>
                                    Senders {txInfo.addressesFrom.length}
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
                        <Skeleton width={200} height={19} br={5} type="gray" isLoading={!txInfo}>
                          {txInfo ? (
                            <>
                              {txInfo?.addressTo ? (
                                <CopyToClipboard value={txInfo.addressTo}>
                                  <Styles.InfoBold>{short(txInfo.addressTo, 20)}</Styles.InfoBold>
                                </CopyToClipboard>
                              ) : null}
                              {txInfo?.addressesTo ? (
                                <Styles.AddressesRow onClick={onViewAddresses}>
                                  <Styles.Addresses>
                                    Recipients {txInfo.addressesTo.length}
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
                        <Skeleton width={100} height={19} br={5} type="gray" isLoading={!txInfo}>
                          <Styles.Date>{dayjs(txInfo?.date).format('MMM D, HH:mm:ss')}</Styles.Date>
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
                  src={isCopied ? checkCopyIcon : copyIcon}
                  width={12}
                  height={isCopied ? 11 : 12}
                />
              </Styles.CopyButton>
            </Styles.HashBlock>
          </Styles.Body>
          {isError || txInfo ? (
            <Button
              label={isError ? 'Try again' : 'View on explorer'}
              onClick={onClickButton}
              icon={isError ? undefined : linkIcon}
            />
          ) : null}
        </Styles.Container>
      </Styles.Wrapper>
      {txInfo?.addressesFrom && txInfo?.addressesTo ? (
        <TxAddressesDrawer
          isActive={activeDrawer === 'txAddresses'}
          onClose={onCloseDrawer}
          addressesFrom={txInfo.addressesFrom}
          addressesTo={txInfo.addressesTo}
          symbol={symbol}
        />
      ) : null}
    </>
  )
}

export default TxHistory
