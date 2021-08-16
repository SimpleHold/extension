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
import { toUpper, price, toLower, short, formatEstimated } from '@utils/format'
import { getWalletName, IWallet, THardware } from '@utils/wallet'

// Assets
import ledgerLogo from '@assets/icons/ledger.svg'
import trezorLogo from '@assets/icons/trezor.svg'

// Styles
import Styles from './styles'

interface Props {
  balance: null | number
  estimated: null | number
  symbol?: string
  walletName: string
  address?: string
  hardware?: THardware
  name?: string
  wallets: IWallet[]
  changeWallet: (address: string, name: string, hardware?: THardware) => void
  tokenChain?: string
  openFrom?: string
}

const WalletCard: React.FC<Props> = (props) => {
  const {
    balance,
    estimated,
    symbol,
    walletName,
    address,
    hardware,
    name,
    wallets,
    changeWallet,
    tokenChain,
    openFrom,
  } = props

  const filterWallets = wallets.filter(
    (wallet: IWallet) => toLower(wallet.address) !== toLower(address)
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

  if (!symbol || !address) {
    return (
      <Styles.Container>
        <Styles.Row isVisible={false} disabled>
          <Skeleton width={40} height={40} br={13} type="gray" isLoading />
          <Styles.Info>
            <Styles.Wallet isVisible={false}>
              <Skeleton width={80} height={16} type="gray" br={4} isLoading />
              <Skeleton width={70} height={17} type="gray" br={4} mt={7} isLoading />
            </Styles.Wallet>
            <Styles.Balances>
              <Skeleton width={120} height={16} type="gray" br={4} isLoading />
              <Skeleton width={65} height={16} type="gray" br={4} mt={7} isLoading />
            </Styles.Balances>
          </Styles.Info>
        </Styles.Row>
      </Styles.Container>
    )
  }

  return (
    <Styles.Container ref={ref}>
      <Styles.Row isVisible={isVisible} onClick={onToggleDropdown} disabled={wallets.length < 2}>
        <CurrencyLogo size={40} br={13} symbol={symbol} chain={tokenChain} name={name} />
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
              <Styles.Estimated>{`$ ${formatEstimated(
                estimated,
                price(estimated)
              )}`}</Styles.Estimated>
            </Skeleton>
          </Styles.Balances>
        </Styles.Info>
      </Styles.Row>
      <Styles.WalletsDropdown isVisible={isVisible} openFrom={openFrom}>
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
