import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import timesIcon from '@assets/icons/times.svg'
import arrowIcon from '@assets/icons/arrow.svg'

// Types
import { IWallet, getWallets, getWalletName } from '@utils/wallet'

// Styles
import Styles from './styles'

interface Props {
  wallets: IWallet[]
  onShowWallets: () => void
  onRemove: (uuid: string) => () => void
}

const SelectedWallets: React.FC<Props> = (props) => {
  const { wallets, onShowWallets, onRemove } = props

  const getNameWallet = (wallet: IWallet): string => {
    if (wallet.walletName) {
      return wallet.walletName
    }

    const walletsList = getWallets()

    if (walletsList) {
      const { symbol, uuid, hardware, chain, name } = wallet

      return getWalletName(walletsList, symbol, uuid, hardware, chain, name)
    }

    return ''
  }

  return (
    <Styles.Container>
      <Styles.WalletsList>
        {wallets.slice(0, 3).map((wallet: IWallet) => {
          const walletName = getNameWallet(wallet)

          return (
            <Styles.Wallet key={walletName} onClick={onRemove(wallet.uuid)}>
              <Styles.WalletName>{walletName}</Styles.WalletName>
              <Styles.WalletButton>
                <SVG src={timesIcon} width={10} height={10} />
              </Styles.WalletButton>
            </Styles.Wallet>
          )
        })}
      </Styles.WalletsList>

      <Styles.ShowMoreBlock onClick={onShowWallets}>
        <Styles.ShowMoreLabel>Show more</Styles.ShowMoreLabel>
        <SVG src={arrowIcon} width={4} height={7} />
      </Styles.ShowMoreBlock>
    </Styles.Container>
  )
}

export default SelectedWallets
