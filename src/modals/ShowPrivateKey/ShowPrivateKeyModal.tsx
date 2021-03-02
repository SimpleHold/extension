import * as React from 'react'

// Components
import ModalWrapper from '@components/ModalWrapper'

// Icons
import modalIcon from '@assets/modalIcons/key.svg'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  privateKey: string | null
}

const ShowPrivateKeyModal: React.FC<Props> = (props) => {
  const { isActive, onClose, privateKey } = props

  return (
    <ModalWrapper isActive={isActive} onClose={onClose} icon={modalIcon}>
      <Styles.Row>
        <Styles.Title>Show private key</Styles.Title>
        {privateKey ? <Styles.PrivateKey>{privateKey}</Styles.PrivateKey> : null}
      </Styles.Row>
    </ModalWrapper>
  )
}

export default ShowPrivateKeyModal
