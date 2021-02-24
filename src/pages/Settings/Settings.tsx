import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import Cover from '@components/Cover'
import Button from '@components/Button'
import CheckBox from '@components/CheckBox'

// Styles
import Styles from './styles'

const Settings: React.FC = () => {
  const history = useHistory()

  const onLogout = (): void => {
    // TODO: Need confirm modal
    localStorage.removeItem('wallets')
    localStorage.removeItem('backup')
    history.push('/welcome')
  }

  const onBack = (): void => {
    history.push('/wallets')
  }

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack backTitle="Wallets" onBack={onBack} />
      <Styles.Container>
        <Styles.Row>
          <Styles.Title>Settings</Styles.Title>
          <Styles.List>
            <Styles.ListItem>
              <Styles.ListRow>
                <Styles.ListTitle>Download backup</Styles.ListTitle>
              </Styles.ListRow>
            </Styles.ListItem>
            <Styles.ListItem>
              <Styles.ListRow>
                <Styles.ListTitle>Send anonymized usage data</Styles.ListTitle>
                <Styles.ListText>
                  Help us improve SimpleHold with sending anonymized clicks and pageview events
                </Styles.ListText>
              </Styles.ListRow>
              <CheckBox value />
            </Styles.ListItem>
          </Styles.List>
        </Styles.Row>
        <Styles.Actions>
          <Button label="Log out & clear cache" onClick={onLogout} isDanger />
        </Styles.Actions>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Settings
