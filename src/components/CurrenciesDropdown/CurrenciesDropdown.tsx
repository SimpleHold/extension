import * as React from 'react'

// Components
import CurrencyLogo from '@components/CurrencyLogo'

// Hooks
import useVisible from '@hooks/useVisible'

// Styles
import Styles from './styles'

interface Props {
  symbol: string
  isDisabled: boolean
  selectedAddress: string
  addresses: string[]
  setAddress: (address: string) => void
}

const CurrenciesDropdown: React.FC<Props> = (props) => {
  const { symbol, isDisabled, selectedAddress, addresses, setAddress } = props

  const { ref, isVisible, setIsVisible } = useVisible(false)

  const openDropDown = (): void => {
    if (!isDisabled) {
      setIsVisible(!isVisible)
    }
  }

  return (
    <Styles.Container ref={ref} onClick={openDropDown}>
      <Styles.SelectedAddressBlock isDisabled={isDisabled}>
        <CurrencyLogo symbol={symbol} width={40} height={40} />
        <Styles.Row>
          <Styles.Address>{selectedAddress}</Styles.Address>
          {!isDisabled ? <Styles.ArrowIconRow /> : null}
        </Styles.Row>
      </Styles.SelectedAddressBlock>
      {isVisible && !isDisabled ? (
        <Styles.AddressesList>
          {addresses.map((address: string) => (
            <Styles.AddressItem key={address} onClick={() => setAddress(address)}>
              <CurrencyLogo symbol={symbol} width={40} height={40} />
              <Styles.Row>
                <Styles.Address>{address}</Styles.Address>
              </Styles.Row>
            </Styles.AddressItem>
          ))}
        </Styles.AddressesList>
      ) : null}
    </Styles.Container>
  )
}

export default CurrenciesDropdown
