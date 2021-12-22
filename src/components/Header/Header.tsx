import * as React from 'react'
import SVG from 'react-inlinesvg'
import { useHistory } from 'react-router-dom'

// Utils
import { logEvent } from '@utils/amplitude'
import { getItem, setItem } from '@utils/storage'

// Config
import { LOCK } from '@config/events'

// Styles
import Styles from './styles'

interface Props {
  withBack?: boolean
  backTitle?: string
  noActions?: boolean
  whiteLogo?: boolean
  onBack?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  withBorder?: boolean
  activePage?: string
  borderColor?: string
  isAbsolute?: boolean
}

const Header: React.FC<Props> = (props) => {
  const {
    withBack,
    backTitle,
    noActions,
    whiteLogo,
    onBack,
    withBorder,
    activePage,
    borderColor,
    isAbsolute,
  } = props

  const history = useHistory()

  const openPage = (page: string): void => {
    history.push(page)
  }

  const lockWallet = (): void => {
    setItem('isLocked', 'true')
    const isPasscodeEnabled = getItem('passcode') !== null

    logEvent({
      name: LOCK,
    })

    return openPage(isPasscodeEnabled ? '/enter-passcode' : '/lock')
  }

  return (
    <Styles.Container withBorder={withBorder} borderColor={borderColor} isAbsolute={isAbsolute}>
      <Styles.LogoRow>
        <Styles.Logo whiteLogo={whiteLogo}>
          <SVG src="../../assets/logoNew.svg" width={30} height={30} title="SimpleHold" />
        </Styles.Logo>
      </Styles.LogoRow>
      <Styles.Row>
        {withBack && onBack && backTitle ? (
          <Styles.Navigate onClick={onBack}>
            <Styles.BackIconRow>
              <SVG src="../../assets/icons/arrow.svg" width={6} height={10} title="Back" />
            </Styles.BackIconRow>
            <Styles.NavigateTitle>{backTitle}</Styles.NavigateTitle>
          </Styles.Navigate>
        ) : null}
        {!noActions ? (
          <Styles.Nav>
            <Styles.NavItem onClick={lockWallet}>
              <SVG src="../../assets/icons/lock.svg" width={13} height={16} title="Lock wallet" />
            </Styles.NavItem>
            <Styles.NavItem
              onClick={() => (activePage === 'settings' ? null : openPage('/settings'))}
              isActive={activePage === 'settings'}
            >
              <SVG src="../../assets/icons/settings.svg" width={16} height={16} title="Settings" />
            </Styles.NavItem>
          </Styles.Nav>
        ) : null}
      </Styles.Row>
    </Styles.Container>
  )
}

export default Header
