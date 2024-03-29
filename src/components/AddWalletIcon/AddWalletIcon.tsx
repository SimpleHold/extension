import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import plusIcon from '@assets/icons/plus.svg'

// Styles
import Styles from './styles'

interface Props {
  small?: boolean
}

const AddWalletIcon: React.FC<Props> = ({ small }) => {
  const iconSize = small ? 12 : 20

  return (
    <Styles.Circle small={small} className={'circle'}>
      <SVG src={plusIcon} width={iconSize} height={iconSize} title="Add new wallet" />
    </Styles.Circle>
  )
}

export default AddWalletIcon
