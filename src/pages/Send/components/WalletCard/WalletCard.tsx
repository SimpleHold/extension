import * as React from 'react'
import SVG from 'react-inlinesvg'
import numeral from 'numeral'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import Skeleton from '@components/Skeleton'

// Hooks
import useVisible from '@hooks/useVisible'

// Utils
import { toUpper, price } from '@utils/format'
import { THardware } from '@utils/wallet'

// Assets
import ledgerLogo from '@assets/icons/ledger.svg'
import trezorLogo from '@assets/icons/trezor.svg'

// Styles
import Styles from './styles'

interface Props {
  balance: null | number
  estimated: null | number
  symbol: string
  walletName: string
  address: string
  hardware?: THardware
  chain?: string
  name?: string
}

const WalletCard: React.FC<Props> = (props) => {
  const { balance, estimated, symbol, walletName, address, hardware, chain, name } = props

  const { ref, isVisible, toggle } = useVisible(false)

  return (
    <Styles.Container ref={ref}>
      <Styles.Row isVisible={isVisible}>
        <CurrencyLogo width={40} height={40} br={13} symbol={symbol} chain={chain} name={name} />
        <Styles.Info>
          <Styles.Wallet>
            <Styles.WalletNameRow onClick={toggle}>
              {hardware ? (
                <Styles.HardwareIcon>
                  <SVG
                    src={hardware.type === 'ledger' ? ledgerLogo : trezorLogo}
                    width={12}
                    height={12}
                  />
                </Styles.HardwareIcon>
              ) : null}

              <Styles.WalletName>{walletName}</Styles.WalletName>
              <Styles.DropdownArrow>
                <SVG src="../../../assets/icons/dropdownArrow.svg" width={8} height={6} />
              </Styles.DropdownArrow>
            </Styles.WalletNameRow>
            <Styles.Address>{address}</Styles.Address>
          </Styles.Wallet>
          <Styles.Balances>
            <Skeleton width={120} height={19} type="gray" br={4} isLoading={balance === null}>
              <Styles.Balance>{`${numeral(balance).format('0.[000000]')} ${toUpper(
                symbol
              )}`}</Styles.Balance>
            </Skeleton>
            <Skeleton width={65} height={17} type="gray" br={4} isLoading={estimated === null}>
              <Styles.Estimated>{`$${price(estimated)}`}</Styles.Estimated>
            </Skeleton>
          </Styles.Balances>
        </Styles.Info>
      </Styles.Row>
      <Styles.WalletsDropdown isVisible={isVisible}>
        <p>123</p>
      </Styles.WalletsDropdown>
    </Styles.Container>
  )
}

export default WalletCard
