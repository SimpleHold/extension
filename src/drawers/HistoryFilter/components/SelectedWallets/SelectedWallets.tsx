import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import timesIcon from '@assets/icons/times.svg'
import arrowIcon from '@assets/icons/arrow.svg'

// Types
import { IWallet, getWalletName } from '@utils/wallet'

// Styles
import Styles from './styles'

interface Props {
  wallets: IWallet[]
  onRemove: (uuid: string) => () => void
}

const SelectedWallets: React.FC<Props> = (props) => {
  const { wallets, onRemove } = props

  return (
    <Styles.Container>
      <Styles.WalletsList>
        {wallets.slice(0, 3).map((wallet: IWallet) => {
          const walletName = getWalletName(wallet)

          return (
            <Styles.Wallet key={walletName}>
              <Styles.WalletName>{walletName}</Styles.WalletName>
              <Styles.WalletButton onClick={onRemove(wallet.uuid)}>
                <SVG src={timesIcon} width={10} height={10} />
              </Styles.WalletButton>
            </Styles.Wallet>
          )
        })}
      </Styles.WalletsList>

      <Styles.ShowMoreBlock>
        <Styles.ShowMoreLabel>Show more</Styles.ShowMoreLabel>
        <SVG src={arrowIcon} width={4} height={7} />
      </Styles.ShowMoreBlock>
    </Styles.Container>
  )
}

export default SelectedWallets
