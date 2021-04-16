import * as React from 'react'
import { Transition } from 'react-transition-group'

// Styles
import Styles from './styles'

interface Props {
  title: string
  children: React.ReactElement<any, any> | null
  isActive: boolean
  onClose: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  icon?: string
}

const TransitionStyles = {
  entering: { transform: 'translate3d(0, 100%, 0)' },
  entered: { transform: 'none' },
  exiting: { transform: 'translate3d(0, 100%, 0)' },
  exited: { display: 'none' },
}

const BackgroundStyles = {
  entering: { opacity: '0' },
  entered: { opacity: '1' },
  exiting: { opacity: '0' },
  exited: { display: 'none' },
}

const DrawerWrapper: React.FC<Props> = (props) => {
  const { title, children, isActive, onClose, icon } = props

  const nodeRef = React.useRef(null)

  return (
    <Transition
      appear
      in={isActive}
      timeout={{ appear: 0, enter: 0, exit: 250 }}
      unmountOnExit
      mountOnEnter
      nodeRef={nodeRef}
    >
      {(state: 'entering' | 'entered' | 'exiting' | 'exited') => (
        <Styles.Wrapper ref={nodeRef}>
          <Styles.Background
            onClick={onClose}
            style={{
              ...BackgroundStyles[state],
            }}
          />
          <Styles.Drawer
            withIcon={icon !== undefined}
            style={{
              ...TransitionStyles[state],
              position: 'fixed',
            }}
          >
            {icon ? (
              <Styles.IconRow>
                <Styles.Icon src={icon} alt="icon" />
              </Styles.IconRow>
            ) : null}
            <Styles.Title>{title}</Styles.Title>
            {children}
          </Styles.Drawer>
        </Styles.Wrapper>
      )}
    </Transition>
  )
}

export default DrawerWrapper
