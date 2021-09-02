import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import timesIcon from '@assets/icons/times.svg'
import arrowIcon from '@assets/icons/arrow.svg'

// Styles
import Styles from './styles'

interface Props {
  walletNames: string[]
  onShowWallets: () => void
}

const SelectedWallets: React.FC<Props> = (props) => {
  const { walletNames, onShowWallets } = props

  return (
    <Styles.Container>
      <Styles.WalletsList>
        {walletNames.slice(0, 3).map((walletName: string) => (
          <Styles.Wallet key={walletName}>
            <Styles.WalletName>{walletName}</Styles.WalletName>
            <Styles.WalletButton>
              <SVG src={timesIcon} width={7} height={7} />
            </Styles.WalletButton>
          </Styles.Wallet>
        ))}
      </Styles.WalletsList>

      <Styles.ShowMoreBlock onClick={onShowWallets}>
        <Styles.ShowMoreLabel>Show more</Styles.ShowMoreLabel>
        <SVG src={arrowIcon} width={4} height={7} />
      </Styles.ShowMoreBlock>
    </Styles.Container>
  )
}

export default SelectedWallets
