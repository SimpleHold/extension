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

  return (
    <Styles.Container ref={ref} onClick={() => setIsVisible(!isVisible)}>
      <Styles.SelectedAddressBlock isDisabled={isDisabled}>
        <CurrencyLogo symbol={symbol} width={40} height={40} />
        <Styles.Row>
          <Styles.Address>{selectedAddress}</Styles.Address>
          {!isDisabled ? <Styles.ArrowIconRow /> : null}
        </Styles.Row>
      </Styles.SelectedAddressBlock>
      {isVisible ? (
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

  // return (
  //   <div ref={ref}>
  //     <Styles.Container isDisabled={isDisabled} onClick={() => setIsVisible(!isVisible)}>
  //       <CurrencyLogo symbol={symbol} width={40} height={40} />
  //       <Styles.Row>
  //         <Styles.Address>{selectedAddress}</Styles.Address>
  //         {!isDisabled ? (
  //           <Styles.Button>
  //             <Styles.ArrowIcon />
  //           </Styles.Button>
  //         ) : null}
  //       </Styles.Row>
  //     </Styles.Container>
  //     {isVisible ? (
  //       <div>
  //         <p>123213</p>
  //       </div>
  //     ) : null}
  //   </div>
  // )
}

export default CurrenciesDropdown
