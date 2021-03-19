import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  title: string
  children: React.ReactNode
  isActive: boolean
  onClose: Function
  icon?: string
}

const DrawerWrapper: React.FC<Props> = (props) => {
  const { title, children, isActive, onClose, icon } = props

  const drawerRef = React.useRef<HTMLDivElement>(null)

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (isActive && drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  return (
    <Styles.Wrapper className={isActive ? 'active' : ''}>
      <Styles.Background onClick={onClick}>
        <Styles.Drawer
          ref={drawerRef}
          className={isActive ? 'active' : ''}
          withIcon={icon !== undefined}
        >
          {icon ? (
            <Styles.IconRow>
              <Styles.Icon src={icon} alt="icon" />
            </Styles.IconRow>
          ) : null}
          <Styles.Title>{title}</Styles.Title>
          {children}
        </Styles.Drawer>
      </Styles.Background>
    </Styles.Wrapper>
  )
}

export default DrawerWrapper
