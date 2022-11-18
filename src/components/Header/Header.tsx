import * as React from 'react'
import SVG from 'react-inlinesvg'
import { useHistory } from 'react-router-dom'

// Utils
import { logEvent } from '@utils/metrics'
import { getItem, setItem } from '@utils/storage'

// Config
import { LOGOUT_SELECT } from '@config/events'

// Assets
import logo from '@assets/logoNew.svg'
import navigationHomeIconNew from '@assets/icons/navigationHomeIconNew.svg'
import arrowIcon from '@assets/icons/arrow.svg'
import lockIconNew from '@assets/icons/lockIconNew.svg'

// Styles
import Styles from './styles'

interface Props {
  withBack?: boolean
  isHomePage?: boolean
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
    isHomePage,
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
      name: LOGOUT_SELECT,
    })

    return openPage(isPasscodeEnabled ? '/enter-passcode' : '/lock')
  }

  return (
    <Styles.Container withBorder={withBorder} borderColor={borderColor} isAbsolute={isAbsolute}>
      <Styles.LogoRow>
        <Styles.Logo whiteLogo={whiteLogo}>
          <SVG src={logo} width={30} height={30} title="SimpleHold" />
        </Styles.Logo>
      </Styles.LogoRow>
      <Styles.Row>
        {isHomePage || (withBack && onBack && backTitle) ? (
          <Styles.Navigate onClick={onBack}>
            <Styles.BackIconRow>
              {isHomePage ? (
                <SVG src={navigationHomeIconNew} width={10} height={10} title={'Home'} />
              ) : (
                <SVG src={arrowIcon} width={6} height={10} title={'Back'} />
              )}
            </Styles.BackIconRow>
            <Styles.NavigateTitle>{isHomePage ? 'Home' : backTitle}</Styles.NavigateTitle>
          </Styles.Navigate>
        ) : null}
        {!noActions ? (
          <Styles.Nav>
            <Styles.NavItem onClick={lockWallet}>
              <SVG src={lockIconNew} width={14} height={15} title="Lock wallet" />
            </Styles.NavItem>
            {/*<Styles.NavItem*/}
            {/*  onClick={() => (activePage === 'settings' ? null : openPage('/settings'))}*/}
            {/*  isActive={activePage === 'settings'}*/}
            {/*>*/}
            {/*  <SVG src="../../assets/icons/settings.svg" width={16} height={16} title="Settings" />*/}
            {/*</Styles.NavItem>*/}
          </Styles.Nav>
        ) : null}
      </Styles.Row>
    </Styles.Container>
  )
}

export default Header
