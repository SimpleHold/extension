import * as React from 'react'
import SVG from 'react-inlinesvg'
import numeral from 'numeral'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import Skeleton from '@components/Skeleton'
import Wallet from '@drawers/Wallets/components/Wallet'

// Hooks
import useVisible from '@hooks/useVisible'

// Utils
import { toUpper, price, toLower, short } from '@utils/format'
import { getWalletName, IWallet, THardware } from '@utils/wallet'

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
  wallets: IWallet[]
  selectedAddress: string
  changeWallet: (address: string, name: string, hardware?: THardware) => void
}

const WalletCard: React.FC<Props> = (props) => {
  const {
    balance,
    estimated,
    symbol,
    walletName,
    address,
    hardware,
    chain,
    name,
    wallets,
    selectedAddress,
    changeWallet,
  } = props

  const filterWallets = wallets.filter(
    (wallet: IWallet) => toLower(wallet.address) !== toLower(selectedAddress)
  )

  const { ref, isVisible, toggle } = useVisible(false)

  const onToggleDropdown = (): void => {
    if (wallets.length > 1) {
      toggle()
    }
  }

  const onClickWallet = (address: string, walletName: string, hardware?: THardware) => (): void => {
    toggle()
    changeWallet(address, walletName, hardware)
  }

  return (
    <Styles.Container ref={ref}>
      <Styles.Row isVisible={isVisible} onClick={onToggleDropdown} disabled={wallets.length < 2}>
        <CurrencyLogo width={40} height={40} br={13} symbol={symbol} chain={chain} name={name} />
        <Styles.Info>
          <Styles.Wallet isVisible={isVisible}>
            <Styles.WalletNameRow>
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
              {wallets.length > 1 ? (
                <Styles.DropdownArrow className="arrow">
                  <SVG src="../../../assets/icons/dropdownArrow.svg" width={8} height={6} />
                </Styles.DropdownArrow>
              ) : null}
            </Styles.WalletNameRow>
            <Styles.Address>{short(address, 12)}</Styles.Address>
          </Styles.Wallet>
          <Styles.Balances>
            <Skeleton width={120} height={16} type="gray" br={4} isLoading={balance === null}>
              <Styles.Balance>{`${numeral(balance).format('0.[000000]')} ${toUpper(
                symbol
              )}`}</Styles.Balance>
            </Skeleton>
            <Skeleton
              width={65}
              height={16}
              type="gray"
              br={4}
              mt={7}
              isLoading={estimated === null}
            >
              <Styles.Estimated>{`$${price(estimated)}`}</Styles.Estimated>
            </Skeleton>
          </Styles.Balances>
        </Styles.Info>
      </Styles.Row>
      <Styles.WalletsDropdown isVisible={isVisible}>
        {filterWallets.map((wallet: IWallet) => {
          const { symbol, chain, name, address, hardware, uuid, contractAddress } = wallet

          const walletName =
            wallet.walletName || getWalletName(wallets, symbol, uuid, hardware, chain, name)

          return (
            <Wallet
              key={`${symbol}/${address}`}
              symbol={symbol}
              chain={chain}
              name={name}
              address={address}
              hardware={hardware}
              walletName={walletName}
              contractAddress={contractAddress}
              onClickWallet={onClickWallet(address, walletName, hardware)}
            />
          )
        })}
      </Styles.WalletsDropdown>
    </Styles.Container>
  )
}

export default WalletCard
