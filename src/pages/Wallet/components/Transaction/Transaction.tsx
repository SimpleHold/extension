import * as React from 'react'
import numeral from 'numeral'
import dayjs from 'dayjs'
import SVG from 'react-inlinesvg'

// Components
import Skeleton from '@components/Skeleton'

// Utils
import { toUpper, price, short } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  data?: {
    type: 'spend' | 'received'
    date: string
    hash: string
    amount: number
    estimated: number
    symbol: string
    isPending: boolean
  }
  isLoading?: boolean
  openTx?: () => void
}

const Transaction: React.FC<Props> = (props) => {
  const { data, isLoading, openTx } = props

  if (isLoading) {
    return (
      <Styles.Container disabled={isLoading}>
        <Styles.Row>
          <Styles.Info>
            <Skeleton width={40} height={40} br={14} type="gray" isLoading />
            <Styles.InfoRow>
              <Skeleton width={80} height={20} type="gray" isLoading />
              <Skeleton width={50} height={17} mt={3} type="gray" isLoading />
            </Styles.InfoRow>
          </Styles.Info>
          <Styles.Amounts>
            <Skeleton width={100} height={19} type="gray" isLoading />
            <Skeleton width={70} height={17} mt={4} type="gray" isLoading />
          </Styles.Amounts>
        </Styles.Row>
      </Styles.Container>
    )
  }

  if (data) {
    const { type, date, hash, amount, estimated, symbol, isPending } = data

    return (
      <Styles.Container onClick={openTx}>
        <Styles.Row>
          <Styles.Info>
            <Styles.TypeRow>
              <Styles.DestinationType isPending={isPending} type={type}>
                <SVG src="../../../assets/icons/txArrow.svg" width={12} height={16} />
              </Styles.DestinationType>
              {isPending ? (
                <Styles.PendingIcon>
                  <SVG src="../../../assets/icons/clock.svg" width={8} height={9.5} />
                </Styles.PendingIcon>
              ) : null}
            </Styles.TypeRow>
            <Styles.InfoRow>
              <Styles.HashRow>
                <Styles.Hash className="tx-hash">{short(hash, 12)}</Styles.Hash>
                <Styles.LinkIcon className="link-icon">
                  <SVG src="../../../assets/icons/txLink.svg" width={12} height={12} />
                </Styles.LinkIcon>
              </Styles.HashRow>
              <Styles.Date>{dayjs(date).format('MMM D')}</Styles.Date>
            </Styles.InfoRow>
          </Styles.Info>
          <Styles.Amounts>
            <Styles.CurrencyAmount>{`${
              amount < 0.000001 ? '< 0.000001' : numeral(amount).format('0.[000000]')
            } ${toUpper(symbol)}`}</Styles.CurrencyAmount>
            <Styles.USDAmount>{`$ ${price(estimated)}`}</Styles.USDAmount>
          </Styles.Amounts>
        </Styles.Row>
      </Styles.Container>
    )
  }

  return null
}

export default Transaction
