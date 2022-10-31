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
import { getTransactionLink, getNetworkFeeSymbol } from '@coins/index'
import { openWebPage } from '@utils/extension'

// Hooks
import useState from '@hooks/useState'

// Types
import { IState } from './types'
import { TTxFullInfo } from '@utils/api/types'

// Styles
import Styles from './styles'

const initialState: IState = {
  isCopied: false,
  activeDrawer: null,
  activeDrawerTabKey: 'senders',
}

type TTxProps = {
  txInfo: TTxFullInfo
}

const TxHistory: React.FC<TTxProps> = () => {
  const history = useHistory()

  const {
    state: {
      hash,
      amount,
      estimated,
      fee,
      feeEstimated,
      chain,
      date,
      isPending,
      symbol,
      addressFrom,
      addressTo,
      addressesFrom,
      addressesTo,
      tokenSymbol,
    },
  } = useLocation<TTxFullInfo>()

  const { state, updateState } = useState(initialState)

  const feeSymbol = getNetworkFeeSymbol(symbol, chain)
  const tokenChain = tokenSymbol ? chain : undefined

  React.useEffect(() => {
    if (state.isCopied) {
      setTimeout(() => {
        updateState({ isCopied: false })
      }, 1000)
    }
  }, [state.isCopied])

  const onViewTx = (): void => {
    const txLink = getTransactionLink(hash, chain, symbol, tokenChain)

    if (txLink) {
      openWebPage(txLink)
    }
  }

  const onCopyHash = (): void => {
    copy(hash)
    updateState({ isCopied: true })
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
            <Styles.Heading>
              <CurrencyLogo size={50} symbol={symbol} chain={tokenChain} />
              <Styles.HeadingInfo>
                <Styles.AmountRow>
                  <Styles.Amount amount={amount}>{`${amount > 0 ? '+' : ''} ${numeral(
                    amount
                  ).format('0.[000000]')} ${toUpper(symbol)}`}</Styles.Amount>
                  {isPending ? (
                    <Styles.PendingIcon>
                      <SVG src={clockIcon} width={16} height={16} />
                    </Styles.PendingIcon>
                  ) : null}
                </Styles.AmountRow>
                <Styles.Estimated>
                  {`$ ${estimated > 0 ? '+' : ''} ${getFormatEstimated(
                    estimated,
                    price(estimated)
                  )}`}
                </Styles.Estimated>
              </Styles.HeadingInfo>
            </Styles.Heading>

            <Styles.Info>
              <Styles.InfoColumn>
                <Styles.InfoColumnRow>
                  <Styles.InfoLabel>Fee</Styles.InfoLabel>
                  <Styles.InfoContent>
                    <Styles.InfoBold>
                      {fee} {toUpper(feeSymbol)}
                    </Styles.InfoBold>
                    <Styles.InfoText>
                      {`$ ${getFormatEstimated(feeEstimated, price(feeEstimated))}`}
                    </Styles.InfoText>
                  </Styles.InfoContent>
                </Styles.InfoColumnRow>
              </Styles.InfoColumn>
              <Styles.InfoColumn>
                <Styles.InfoColumnRow pb={7}>
                  <Styles.InfoLabel>From</Styles.InfoLabel>
                  <Styles.InfoContent>
                    <>
                      {addressFrom ? (
                        <CopyToClipboard value={addressFrom} zIndex={3}>
                          <Styles.InfoBold>{short(addressFrom, 20)}</Styles.InfoBold>
                        </CopyToClipboard>
                      ) : null}
                      {addressesFrom ? (
                        <Styles.AddressesRow onClick={onViewAddresses('senders')}>
                          <Styles.Addresses>Senders {addressesFrom.length}</Styles.Addresses>
                          <SVG src="../../../assets/icons/dropdownArrow.svg" width={8} height={6} />
                        </Styles.AddressesRow>
                      ) : null}
                    </>
                  </Styles.InfoContent>
                </Styles.InfoColumnRow>
                <Styles.InfoColumnRow pt={7}>
                  <Styles.InfoLabel>To</Styles.InfoLabel>
                  <Styles.InfoContent>
                    <>
                      {addressTo ? (
                        <CopyToClipboard value={addressTo}>
                          <Styles.InfoBold>{short(addressTo, 20)}</Styles.InfoBold>
                        </CopyToClipboard>
                      ) : null}
                      {addressesTo ? (
                        <Styles.AddressesRow onClick={onViewAddresses('recipients')}>
                          <Styles.Addresses>Recipients {addressesTo.length}</Styles.Addresses>
                          <SVG src="../../../assets/icons/dropdownArrow.svg" width={8} height={6} />
                        </Styles.AddressesRow>
                      ) : null}
                    </>
                  </Styles.InfoContent>
                </Styles.InfoColumnRow>
              </Styles.InfoColumn>
              <Styles.InfoColumn>
                <Styles.InfoColumnRow>
                  <Styles.InfoLabel>Created</Styles.InfoLabel>
                  <Styles.InfoContent>
                    <Styles.Date>{dayjs(date).format('MMM D, HH:mm:ss')}</Styles.Date>
                  </Styles.InfoContent>
                </Styles.InfoColumnRow>
              </Styles.InfoColumn>
            </Styles.Info>
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
          <Button label={'View on explorer'} onClick={onViewTx} icon={linkIcon} />
        </Styles.Container>
      </Styles.Wrapper>
      {addressesFrom && addressesTo ? (
        <TxAddressesDrawer
          isActive={state.activeDrawer === 'txAddresses'}
          onClose={onCloseDrawer}
          addressesFrom={addressesFrom}
          addressesTo={addressesTo}
          symbol={symbol}
          activeDrawerTabKey={state.activeDrawerTabKey}
        />
      ) : null}
    </>
  )
}

export default TxHistory
