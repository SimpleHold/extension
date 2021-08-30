import * as React from 'react'

// Components
import Skeleton from '@components/Skeleton'
import CurrencyLogo from '@components/CurrencyLogo'

// Utils
import { short } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  isLoading?: boolean
  data?: {
    symbol: string
    hash: string
    name: string
    amount: number
    estimated: number
  }
}

const Item: React.FC<Props> = (props) => {
  const { isLoading, data } = props

  if (isLoading) {
    return (
      <Styles.Container>
        <Skeleton width={40} height={40} br={14} isLoading type="gray" />
        <Styles.Row>
          <Styles.AddressInfo>
            <Skeleton width={80} height={20} br={5} isLoading type="gray" />
            <Skeleton width={50} height={16} br={5} mt={3} isLoading type="gray" />
          </Styles.AddressInfo>
          <Styles.Balances>
            <Skeleton width={100} height={19} br={5} isLoading type="gray" />
            <Skeleton width={70} height={16} br={5} mt={4} isLoading type="gray" />
          </Styles.Balances>
        </Styles.Row>
      </Styles.Container>
    )
  }

  if (data) {
    const { symbol, hash, name, amount, estimated } = data

    return (
      <Styles.Container>
        <CurrencyLogo size={40} symbol={symbol} />
        <Styles.Row>
          <Styles.AddressInfo>
            <Styles.Hash>{hash}</Styles.Hash>
            <Styles.WalletName>{name}</Styles.WalletName>
          </Styles.AddressInfo>
          <Styles.Balances>
            <Styles.Amount>{amount}</Styles.Amount>
            <Styles.Estimated>{estimated}</Styles.Estimated>
          </Styles.Balances>
        </Styles.Row>
      </Styles.Container>
    )
  }

  return null
}

export default Item
