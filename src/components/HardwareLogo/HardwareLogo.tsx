import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import ledgerLogo from '@assets/icons/ledger.svg'
import trezorLogo from '@assets/icons/trezor.svg'

// Styles
import Styles from './styles'

interface Props {
  size: number
  color: string
  type?: 'trezor' | 'ledger'
  mr?: number
}

const HardwareLogo: React.FC<Props> = (props) => {
  const { type, size, mr, color } = props

  if (!type) {
    return null
  }

  return (
    <Styles.Container color={color} size={size} mr={mr}>
      <SVG src={type === 'ledger' ? ledgerLogo : trezorLogo} width={size} height={size} />
    </Styles.Container>
  )
}

export default HardwareLogo
