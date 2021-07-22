import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import moreIcon from '@assets/icons/more.svg'

// Styles
import Styles from './styles'

const WalletHeading: React.FC = () => {
  return (
    <Styles.Container>
      <Styles.WalletName>Wallet name</Styles.WalletName>
      <Styles.MoreButton>
        <SVG src={moreIcon} width={16} height={3.36} />
      </Styles.MoreButton>
    </Styles.Container>
  )
}

export default WalletHeading
