import * as React from 'react'
import SVG from 'react-inlinesvg'
import { useHistory } from 'react-router-dom'

// Utils
import { logEvent } from '@utils/amplitude'

// Config
import { LOCK } from '@config/events'

// Styles
import Styles from './styles'

interface Props {
  withBack?: boolean
  backTitle?: string
  noActions?: boolean
  logoColor?: string
  onBack?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  withBorder?: boolean
  activePage?: string
}

const Header: React.FC<Props> = (props) => {
  const {
    withBack,
    backTitle,
    noActions,
    logoColor = '#FFFFFF',
    onBack,
    withBorder,
    activePage,
  } = props

  const history = useHistory()

  const openPage = (page: string): void => {
    history.push(page)
  }

  const lockWallet = (): void => {
    localStorage.setItem('isLocked', 'true')
    const isPasscodeEnabled = localStorage.getItem('passcode') !== null

    logEvent({
      name: LOCK,
    })

    return openPage(isPasscodeEnabled ? '/enter-passcode' : '/lock')
  }

  return (
    <Styles.Container withBorder={withBorder}>
      <Styles.LogoRow>
        <Styles.Logo color={logoColor}>
          <SVG src="../../assets/logo.svg" width={30} height={30} title="SimleHold" />
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
