import * as React from 'react'
import numeral from 'numeral'

// Components
import Skeleton from '@components/Skeleton'
import CheckBox from '@components/CheckBox'

// Utils
import { short, toUpper } from '@utils/format'
import { getSingleBalance } from '@utils/currencies'
import { getCurrency } from '@config/currencies'

// Styles
import Styles from './styles'

interface Props {
  symbol: string
  address: string
  isSelected: boolean
  onToggle: () => void
  isDisabled?: boolean
}

const CurrencyAddress: React.FC<Props> = (props) => {
  const { symbol, address, isSelected, onToggle, isDisabled } = props

  const [balance, setBalance] = React.useState<null | number>(null)

  React.useEffect(() => {
    onGetBalance()
  }, [])

  const currency = getCurrency(symbol)

  const onGetBalance = async (): Promise<void> => {
    const request = await getSingleBalance({symbol, address, chain: currency?.chain})
    setBalance(request.balance)
  }

  return (
    <Styles.AddressBlock>
      <Styles.CheckBoxRow>
        <CheckBox
          isDisabled={isDisabled}
          value={isSelected}
          onClick={onToggle}
          iconWidth={10}
          iconHeight={8}
        />
      </Styles.CheckBoxRow>
      <Styles.AddressBlockRow>
        <Styles.Address>{short(address, 25)}</Styles.Address>
        <Skeleton width={90} height={14} type="gray" br={4} isLoading={balance === null} mt={2}>
          <Styles.Balance>{`${numeral(balance).format('0.[000000]')} ${toUpper(
            symbol
          )}`}</Styles.Balance>
        </Skeleton>
      </Styles.AddressBlockRow>
    </Styles.AddressBlock>
  )
}

export default CurrencyAddress
