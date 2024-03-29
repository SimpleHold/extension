import * as React from 'react'
import { Transition, TransitionStatus } from 'react-transition-group'
import SVG from 'react-inlinesvg'

// Assets
import timesIcon from '@assets/icons/times.svg'

// Styles
import Styles from './styles'

interface Props {
  title?: string
  children: React.ReactElement<any, any> | null
  isActive: boolean
  onClose: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  icon?: string
  openFrom?: string
  withCloseIcon?: boolean
  padding?: string
  height?: number
  withoutDimScreen?: boolean
  isFullScreen?: boolean
  hideStrandgeDiv?: boolean
}

const BackgroundStyles = {
  entering: { opacity: '0' },
  entered: { opacity: '1' },
  exiting: { opacity: '0' },
  exited: { display: 'none' },
  unmounted: { display: 'none' },
}

const DrawerWrapper: React.FC<Props> = (props) => {
  const {
    title,
    children,
    isActive,
    onClose,
    icon,
    openFrom,
    withCloseIcon,
    padding,
    height,
    withoutDimScreen,
    isFullScreen,
    hideStrandgeDiv,
  } = props

  const nodeRef = React.useRef(null)

  const isWindowedMode = window.location.pathname === '/popup.html' && window.name !== ''

  const drawerStyle = {
    entering: {
      transform: `translate3d(0, ${openFrom === 'browser' ? '80px' : '100%'}, 0)`,
    },
    entered: { transform: 'none' },
    exiting: { transform: 'translate3d(0, 100%, 0)' },
    exited: { display: 'none' },
    unmounted: { display: 'none' },
  }

  return (
    <Transition
      appear
      in={isActive}
      timeout={{ appear: 0, enter: 0, exit: 250 }}
      unmountOnExit
      mountOnEnter
      nodeRef={nodeRef}
    >
      {(state: TransitionStatus) => (
        <Styles.Wrapper ref={nodeRef}>
          <Styles.Background
            isFullScreen={isFullScreen}
            onClick={onClose}
            style={{
              ...BackgroundStyles[state],
            }}
            openFrom={openFrom}
            isWindowedMode={isWindowedMode}
            withoutDimScreen={withoutDimScreen}
          />
          <Styles.Drawer
            isFullScreen={isFullScreen}
            isWindowedMode={isWindowedMode}
            openFrom={openFrom}
            padding={padding}
            height={height}
            style={{
              ...drawerStyle[state],
            }}
          >
            {((title && title.length > 30) || icon) && !hideStrandgeDiv ? (
              <div style={{ width: '100%', height: '25px' }} />
            ) : null}
            {icon ? (
              <Styles.IconRow>
                <Styles.Icon src={icon} alt="icon" />
              </Styles.IconRow>
            ) : null}
            {title ? <Styles.Title>{title}</Styles.Title> : null}

            {withCloseIcon ? (
              <Styles.CloseIconRow onClick={onClose}>
                <SVG src={timesIcon} width={16} height={16} />
              </Styles.CloseIconRow>
            ) : null}
            {children}
          </Styles.Drawer>
        </Styles.Wrapper>
      )}
    </Transition>
  )
}

export default DrawerWrapper
