import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  children: React.ReactNode
  isActive: boolean
  onClose: Function
}

const ModalWrapper: React.FC<Props> = (props) => {
  const { children, isActive, onClose } = props

  const modalRef = React.useRef<HTMLDivElement>(null)

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  return (
    <Styles.Container isActive={isActive}>
      <Styles.Background onClick={onClick}>
        <Styles.Modal ref={modalRef}>
          <Styles.Circle>
            <Styles.IconRow />
          </Styles.Circle>
          {children}
        </Styles.Modal>
      </Styles.Background>
    </Styles.Container>
  )
}

export default ModalWrapper
