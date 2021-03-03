import * as React from 'react'

// Components
import ModalWrapper from '@components/ModalWrapper'
import Button from '@components/Button'

// Icons
import modalIcon from '@assets/modalIcons/logout.svg'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onConfirm: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ConfirmLogoutModal: React.FC<Props> = (props) => {
  const { isActive, onClose, onConfirm } = props

  return (
    <ModalWrapper isActive={isActive} onClose={onClose} icon={modalIcon}>
      <Styles.Row>
        <Styles.Title>Confirm log out</Styles.Title>
        <Styles.Text>
          Are you sure that you want to clear cache and log out? Note: backup file will downloaded
          after you confirm this action
        </Styles.Text>
        <Styles.Actions>
          <Button label="Cancel" isLight onClick={onClose} mr={7.5} isSmall />
          <Button label="Log out" onClick={onConfirm} ml={7.5} isSmall />
        </Styles.Actions>
      </Styles.Row>
    </ModalWrapper>
  )
}

export default ConfirmLogoutModal
