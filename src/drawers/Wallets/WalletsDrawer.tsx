import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Wallet from './components/Wallet'

// Utils
import { IWallet, getWalletName } from '@utils/wallet'
import { toLower } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  isActive: boolean
  selectedAddress: string
  wallets: IWallet[]
  onClickWallet: (address: string) => () => void
}

const WalletsDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, selectedAddress, wallets, onClickWallet } = props

  const filterWallets = wallets.filter(
    (wallet: IWallet) => toLower(wallet.address) !== toLower(selectedAddress)
  )

  return (
    <DrawerWrapper
      title="My wallets"
      padding="30px 0 0 0"
      isActive={isActive}
      onClose={onClose}
      withCloseIcon
    >
      <Styles.Row>
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
              onClickWallet={onClickWallet(address)}
            />
          )
        })}
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default WalletsDrawer
