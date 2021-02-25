import * as React from 'react'

// Components
import ModalWrapper from '@components/ModalWrapper'
import Button from '@components/Button'

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
    <ModalWrapper isActive={isActive} onClose={onClose}>
      <Styles.Row>
        <Styles.Title>Confirm log out</Styles.Title>
        <Styles.Text>Are you sure you want to log out and clear the cache?</Styles.Text>
        <Styles.Actions>
          <Button label="Cancel" isLight onClick={onClose} mr={7.5} isSmall />
          <Button label="Log out" isFullDanger onClick={onConfirm} ml={7.5} isSmall />
        </Styles.Actions>
      </Styles.Row>
    </ModalWrapper>
  )
}

export default ConfirmLogoutModal
