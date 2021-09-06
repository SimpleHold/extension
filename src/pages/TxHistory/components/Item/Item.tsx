import * as React from 'react'
import SVG from 'react-inlinesvg'
import numeral from 'numeral'

// Components
import Skeleton from '@components/Skeleton'
import CurrencyLogo from '@components/CurrencyLogo'
import HardwareLogo from '@components/HardwareLogo'

// Utils
import { toUpper, short, formatEstimated, price } from '@utils/format'

// Assets
import clockIcon from '@assets/icons/clock.svg'

// Types
import { THardware } from '@utils/wallet'

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
    hardware?: THardware
    isPending?: boolean
  }
  onClick?: () => void
}

const Item: React.FC<Props> = (props) => {
  const { isLoading, data, onClick } = props

  if (isLoading) {
    return (
      <Styles.Container disabled>
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
    const { symbol, hash, name, amount, estimated, hardware, isPending } = data

    return (
      <Styles.Container onClick={onClick}>
        <CurrencyLogo size={40} symbol={symbol} />
        <Styles.Row>
          <Styles.AddressInfo>
            <Styles.Hash>{short(hash, 15)}</Styles.Hash>
            <Styles.WalletNameRow>
              <HardwareLogo type={hardware?.type} size={12} mr={4} color="#7D7E8D" />
              <Styles.WalletName>{name}</Styles.WalletName>
            </Styles.WalletNameRow>
          </Styles.AddressInfo>
          <Styles.Balances>
            <Styles.AmountRow>
              {isPending ? (
                <Styles.PendingIcon>
                  <SVG src={clockIcon} width={12} height={12} />
                </Styles.PendingIcon>
              ) : null}
              <Styles.Amount>{`${numeral(amount).format('0.[000000]')} ${toUpper(
                symbol
              )}`}</Styles.Amount>
            </Styles.AmountRow>
            <Styles.Estimated>
              {`$ ${formatEstimated(estimated, price(estimated))}`}
            </Styles.Estimated>
          </Styles.Balances>
        </Styles.Row>
      </Styles.Container>
    )
  }

  return null
}

export default Item
