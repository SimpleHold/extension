import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Wallet from './components/Wallet'

// Utils
import { IWallet, getWallets, getWalletName } from '@utils/wallet'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  isActive: boolean
}

const WalletsDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive } = props

  const [wallets, setWallets] = React.useState<IWallet[]>([])

  React.useEffect(() => {
    getWalletsList()
  }, [])

  const getWalletsList = (): void => {
    const walletsList = getWallets()

    if (walletsList) {
      setWallets(walletsList)
    }
  }

  return (
    <DrawerWrapper
      title="My wallets"
      padding="30px 0 0 0"
      isActive={isActive}
      onClose={onClose}
      withCloseIcon
    >
      <Styles.Row>
        {wallets.map((wallet: IWallet) => {
          const { symbol, chain, name, address, hardware, uuid, contractAddress } = wallet

          const walletName = wallet.walletName || getWalletName(wallets, symbol, uuid, chain, name)

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
            />
          )
        })}
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default WalletsDrawer
