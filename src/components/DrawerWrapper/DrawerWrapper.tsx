import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  title: string
  children: React.ReactNode
  isActive: boolean
  onClose: Function
}

const DrawerWrapper: React.FC<Props> = (props) => {
  const { title, children, isActive, onClose } = props

  const drawerRef = React.useRef<HTMLDivElement>(null)

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (isActive && drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  return (
    <Styles.Wrapper className={isActive ? 'active' : ''}>
      <Styles.Background onClick={onClick}>
        <Styles.Drawer ref={drawerRef} className={isActive ? 'active' : ''}>
          <Styles.Title>{title}</Styles.Title>
          {children}
        </Styles.Drawer>
      </Styles.Background>
    </Styles.Wrapper>
  )
}

export default DrawerWrapper
