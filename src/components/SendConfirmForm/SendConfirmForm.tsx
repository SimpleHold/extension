import * as React from 'react'
import { observer } from 'mobx-react-lite'
import SVG from 'react-inlinesvg'

// Utils
import { short, toUpper, price } from '@utils/format'
import { plus, multiplied } from '@utils/bn'

// Tokens
import { getToken } from '@tokens/index'

// Config
import { getCurrencyInfo } from '@config/currencies/utils'

// Store
import { useSendStore } from '@store/send/store'

// Assets
import sendConfirmArrowUpIcon from '@assets/icons/sendConfirmArrowUp.svg'
import sendConfirmArrowDownIcon from '@assets/icons/sendConfirmArrowDown.svg'
import sendConfirmFeeIcon from '@assets/icons/sendConfirmFee.svg'

// Styles
import Styles from './styles'

interface Props {
  addressTo: string
  amount: string
  feeEstimated: number
}

type TItemProps = {
  label: string
  value: string
  badge?: string
  icon?: string
}

const SendConfirmForm: React.FC<Props> = (props) => {
  const { addressTo, amount, feeEstimated } = props

  const { wallet, fee, feeSymbol, coinPrice } = useSendStore()

  const usdAmount = price(multiplied(+amount, coinPrice))
  const feeAmount = price(multiplied(fee, feeEstimated))
  const totalAmount = price(multiplied(plus(+amount, fee), coinPrice))

  const coinInfo = wallet
    ? wallet?.chain
      ? getToken(wallet.symbol, wallet.chain)
      : getCurrencyInfo(wallet?.symbol)
    : null

  const renderItem = ({ label, value, badge, icon }: TItemProps) => (
    <Styles.Item>
      <Styles.ItemIconRow>
        {icon ? <SVG src={icon} width={16} height={16} /> : null}
      </Styles.ItemIconRow>
      <Styles.ItemRow>
        <Styles.ItemLabel>{label}</Styles.ItemLabel>
        <Styles.ItemRight>
          <Styles.ItemValue>{value}</Styles.ItemValue>
          {badge ? (
            <Styles.Badge>
              <Styles.BadgeValue>{badge}</Styles.BadgeValue>
            </Styles.Badge>
          ) : null}
        </Styles.ItemRight>
      </Styles.ItemRow>
    </Styles.Item>
  )

  if (wallet) {
    return (
      <Styles.Container>
        <Styles.Group>
          {renderItem({
            label: 'From',
            value: short(wallet.address, 18),
            icon: sendConfirmArrowUpIcon,
          })}
          {renderItem({ label: 'To', value: short(addressTo, 18), icon: sendConfirmArrowDownIcon })}
        </Styles.Group>
        <Styles.DividerLine />
        <Styles.Group>
          {renderItem({
            label: 'Amount',
            value: `${amount} ${toUpper(wallet.symbol)}`,
            badge: `$ ${usdAmount}`,
            icon: coinInfo?.logo,
          })}
          {renderItem({
            label: 'Fee',
            value: `${fee} ${toUpper(feeSymbol)}`,
            badge: `$ ${feeAmount}`,
            icon: sendConfirmFeeIcon,
          })}
        </Styles.Group>
        {toUpper(wallet.symbol) === toUpper(feeSymbol) ? (
          <Styles.Summary>
            <Styles.SummaryTitle>
              {`${plus(amount, fee)} ${toUpper(wallet.symbol)}`}
            </Styles.SummaryTitle>
            <Styles.SummaryText>$ {totalAmount}</Styles.SummaryText>
          </Styles.Summary>
        ) : null}
      </Styles.Container>
    )
  }

  return null
}

export default observer(SendConfirmForm)
