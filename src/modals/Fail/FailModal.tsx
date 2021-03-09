import * as React from 'react'

// Components
import ModalWrapper from '@components/ModalWrapper'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  text: string
}

const FailModal: React.FC<Props> = (props) => {
  const { isActive, onClose, text } = props

  return (
    <ModalWrapper isActive={isActive} onClose={onClose} icon="../../assets/modalIcons/fail.svg">
      <Styles.Row>
        <Styles.Title>Fail!</Styles.Title>
        <Styles.Text>{text}</Styles.Text>
      </Styles.Row>
    </ModalWrapper>
  )
}

export default FailModal
