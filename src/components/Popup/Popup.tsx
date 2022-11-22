import * as React from 'react'

// Components
import Portal from '@components/Portal'

// Styles
import Styles from './styles'

interface Props {
  children: React.ReactNode
  onBlurHandler?: () => void
}

const Popup: React.FC<Props> = ({ children, onBlurHandler }) => {
  const onBlur = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    onBlurHandler && onBlurHandler()
  }

  return (
    <Portal>
      <Styles.DimScreen onClick={onBlur}>
        <Styles.Container>{children}</Styles.Container>
      </Styles.DimScreen>
    </Portal>
  )
}

export default Popup
