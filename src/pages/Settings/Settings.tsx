import * as React from 'react'
import { useHistory } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import Header from '@components/Header'
import Cover from '@components/Cover'
import Button from '@components/Button'
import Switch from '@components/Switch'

// Modals
import ConfirmLogoutModal from '@modals/ConfirmLogout'

// Icons
import cloudIcon from '@assets/icons/cloud.svg'
import linkIcon from '@assets/icons/link.svg'

// Styles
import Styles from './styles'

interface List {
  isButton?: boolean
  title: string
  text?: string
  icon?: {
    source: string
    width: number
    height: number
  }
  onClick?: () => void | null
  withSwitch?: boolean
  switchValue?: boolean
  onToggle?: () => void
}

const Settings: React.FC = () => {
  const [activeModal, setActiveModal] = React.useState<null | string>(null)
  const history = useHistory()

  const list: List[] = [
    {
      isButton: true,
      title: 'Download backup',
      icon: {
        source: cloudIcon,
        width: 22,
        height: 14,
      },
      onClick: () => null,
    },
    // {
    //   title: 'Send anonymized usage data',
    //   text: 'Help us improve SimpleHold with sending anonymized clicks and pageview events',
    //   withSwitch: true,
    //   switchValue: false,
    //   onToggle: () => null,
    // },
    {
      isButton: true,
      title: 'Contact to support',
      icon: {
        source: linkIcon,
        width: 16,
        height: 16,
      },
      onClick: () => null,
    },
  ]

  const onLogout = (): void => {
    setActiveModal('confirmLogout')
  }

  const onConfirmLogout = (): void => {
    localStorage.removeItem('wallets')
    localStorage.removeItem('backup')
    history.push('/welcome')
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack backTitle="Back" onBack={history.goBack} activePage="settings" />
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Settings</Styles.Title>

            <Styles.List>
              {list.map((list: List) => {
                const {
                  isButton,
                  title,
                  icon = null,
                  withSwitch,
                  switchValue,
                  onToggle,
                  text,
                  onClick,
                } = list

                return (
                  <Styles.ListItem key={title} isButton={isButton} onClick={onClick}>
                    <Styles.ListItemRow>
                      <Styles.ListTitleRow>
                        <Styles.ListTitle>{title}</Styles.ListTitle>
                        {withSwitch && switchValue !== undefined && onToggle ? (
                          <Switch value={switchValue} onToggle={onToggle} />
                        ) : null}
                      </Styles.ListTitleRow>
                      {text ? <Styles.Text>{text}</Styles.Text> : null}
                    </Styles.ListItemRow>
                    {icon ? (
                      <Styles.IconRow>
                        <SVG
                          src={icon.source}
                          width={icon.width}
                          height={icon.height}
                          title="icon"
                        />
                      </Styles.IconRow>
                    ) : null}
                  </Styles.ListItem>
                )
              })}
            </Styles.List>
          </Styles.Row>
          <Styles.Actions>
            <Button label="Log out & clear cache" onClick={onLogout} isDanger />
          </Styles.Actions>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmLogoutModal
        isActive={activeModal === 'confirmLogout'}
        onClose={() => setActiveModal(null)}
        onConfirm={onConfirmLogout}
      />
    </>
  )
}

export default Settings
