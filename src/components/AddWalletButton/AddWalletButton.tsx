import * as React from 'react'

// Components
import AddWalletIcon from '@components/AddWalletIcon'

// Styles
import Styles from './styles'

interface Props {
  onClick: () => void
  minimize?: boolean
}

const AddWalletButton: React.FC<Props> = ({ onClick, minimize = false }) => {

  return (
    <Styles.Container onClick={onClick}>
      {minimize
        ? <Styles.Wrapper isCollapsed={minimize}>
          <Styles.Badge className={'badge'}>
            <AddWalletIcon small />
            <Styles.Label>Add</Styles.Label>
          </Styles.Badge>
        </Styles.Wrapper>
        : <Styles.Wrapper isCollapsed={!minimize}>
          <AddWalletIcon />
        </Styles.Wrapper>
      }
    </Styles.Container>
  )
}

export default AddWalletButton
