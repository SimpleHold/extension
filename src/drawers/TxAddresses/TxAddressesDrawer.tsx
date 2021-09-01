import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import CurrencyLogo from '@components/CurrencyLogo'

// Types
import { TTxHistoryAddress } from '@utils/api/types'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  isActive: boolean
  addresses: TTxHistoryAddress[]
}

const TxAddressesDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, addresses } = props

  return (
    <DrawerWrapper
      title="Addresses"
      isActive={isActive}
      onClose={onClose}
      withCloseIcon
      height={540}
    >
      <Styles.Row>
        {addresses.map((item: TTxHistoryAddress) => {
          const { address, amount, estimated } = item

          return (
            <Styles.AddressBlock key={address}>
              <CurrencyLogo size={40} symbol="btc" />
              <Styles.AddressRow>
                <Styles.Address>{address}</Styles.Address>
                <Styles.Amount>{amount}</Styles.Amount>
                <Styles.Estimated>{estimated}</Styles.Estimated>
              </Styles.AddressRow>
            </Styles.AddressBlock>
          )
        })}
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default TxAddressesDrawer
