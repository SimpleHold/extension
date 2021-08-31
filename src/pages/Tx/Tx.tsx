import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'
import dayjs from 'dayjs'
import copy from 'copy-to-clipboard'

// Components
import Header from '@components/Header'
import Cover from '@components/Cover'
import Button from '@components/Button'
import CurrencyLogo from '@components/CurrencyLogo'
import Skeleton from '@components/Skeleton'
import CopyToClipboard from '@components/CopyToClipboard'

// Assets
import linkIcon from '@assets/icons/link.svg'
import copyIcon from '@assets/icons/copy.svg'
import checkCopyIcon from '@assets/icons/checkCopy.svg'

// Utils
import { short, toUpper } from '@utils/format'
import { getTransactionLink } from '@utils/currencies'
import { openWebPage } from '@utils/extension'

// Styles
import Styles from './styles'

interface ILocationState {
  hash: string
  symbol: string
  chain: string
}

type TTxInfo = {
  fee: number
  feeEstimated: number
  addressFrom: string
  addressTo: string
  date: string
}

const TxHistory: React.FC = () => {
  const history = useHistory()
  const {
    state: { hash, symbol, chain },
  } = useLocation<ILocationState>()

  const [txInfo, setTxInfo] = React.useState<TTxInfo | null>(null)
  const [isCopied, setIsCopied] = React.useState<boolean>(false)

  React.useEffect(() => {
    getTxsInfo()
  }, [])

  React.useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }, [isCopied])

  const getTxsInfo = async (): Promise<void> => {
    setTimeout(() => {
      setTxInfo({
        fee: 0.005,
        feeEstimated: 14.23,
        addressFrom: '1BXpV6NKYVxPg5kxCLjtzfTC24FAysSK7x',
        addressTo: '16FqBrvNEdtbwVDbw12geKo7H6JvPZHf9T',
        date: new Date().toISOString(),
      })
    }, 1000)
  }

  const onViewTx = (): void => {
    openWebPage(getTransactionLink(hash, symbol, chain))
  }

  const onCopyHash = (): void => {
    copy(hash)
    setIsCopied(true)
  }

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack backTitle="History" onBack={history.goBack} />
      <Styles.Container>
        <Styles.Body>
          <Styles.Heading>
            <Skeleton width={50} height={50} br={16} type="gray" isLoading={!txInfo}>
              <CurrencyLogo size={50} symbol={symbol} />
            </Skeleton>
            <Styles.HeadingInfo>
              <Skeleton width={160} height={27} br={5} type="gray" isLoading={!txInfo}>
                <Styles.Amount>- 0.165558 BTC</Styles.Amount>
              </Skeleton>
              <Skeleton width={50} height={19} br={5} mt={4} type="gray" isLoading={!txInfo}>
                <Styles.Estimated>$ 5.75</Styles.Estimated>
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
                  <Skeleton width={50} height={16} br={5} mt={5} type="gray" isLoading={!txInfo}>
                    <Styles.InfoText>$ {txInfo?.feeEstimated}</Styles.InfoText>
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
                      <CopyToClipboard value={txInfo.addressFrom}>
                        <Styles.InfoBold>{short(txInfo.addressFrom, 20)}</Styles.InfoBold>
                      </CopyToClipboard>
                    ) : null}
                  </Skeleton>
                </Styles.InfoContent>
              </Styles.InfoColumnRow>
              <Styles.InfoColumnRow pt={7}>
                <Styles.InfoLabel>To</Styles.InfoLabel>
                <Styles.InfoContent>
                  <Skeleton width={200} height={19} br={5} type="gray" isLoading={!txInfo}>
                    {txInfo ? (
                      <CopyToClipboard value={txInfo.addressTo}>
                        <Styles.InfoBold>{short(txInfo.addressTo, 20)}</Styles.InfoBold>
                      </CopyToClipboard>
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
        <Button label="View on explorer" onClick={onViewTx} icon={linkIcon} />
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default TxHistory
