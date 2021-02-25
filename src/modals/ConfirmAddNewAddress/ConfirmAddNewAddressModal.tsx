import * as React from 'react'

// Components
import ModalWrapper from '@components/ModalWrapper'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ConfirmAddNewAddressModal: React.FC<Props> = (props) => {
  const { isActive, onClose } = props

  return (
    <ModalWrapper isActive={isActive} onClose={onClose}>
      <Styles.Row>
        <Styles.Title>Confirm adding new address</Styles.Title>
      </Styles.Row>
    </ModalWrapper>
  )
}

export default ConfirmAddNewAddressModal
