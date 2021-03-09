import * as React from 'react'
import SVG from 'react-inlinesvg'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import Link from '@components/Link'

// Utils
import { logEvent } from '@utils/amplitude'

// Config
import { WELCOME, START_CREATE, START_RESTORE } from '@config/events'

// Styles
import Styles from './styles'

const Wallets: React.FC = () => {
  const history = useHistory()

  React.useEffect(() => {
    logEvent({
      name: WELCOME,
    })
  }, [])

  const onCreateWallet = (): void => {
    logEvent({
      name: START_CREATE,
    })

    history.push('/create-wallet')
  }

  const onRestoreWallet = (): void => {
    logEvent({
      name: START_RESTORE,
    })

    history.push('/restore-wallet')
  }

  return (
    <Styles.Wrapper>
      <Header noActions logoColor="#3FBB7D" withBorder />
      <Styles.Container>
        <Styles.Title>Welcome</Styles.Title>
        <Styles.Description>
          SimpleHold would like to gather usage data to better understand how our users interact
        </Styles.Description>
        <Styles.WalletActions>
          <Styles.Action onClick={onCreateWallet}>
            <Styles.ActionIcon>
              <SVG
                src="../../assets/icons/plusCircle.svg"
                width={20}
                height={20}
                title="Create new wallet"
              />
            </Styles.ActionIcon>
            <Styles.ActionName>Create new wallet</Styles.ActionName>
          </Styles.Action>
          <Styles.Action onClick={onRestoreWallet}>
            <Styles.ActionIcon>
              <SVG
                src="../../assets/icons/restore.svg"
                width={20}
                height={20}
                title="Restore wallet"
              />
            </Styles.ActionIcon>
            <Styles.ActionName>Restore wallet</Styles.ActionName>
          </Styles.Action>
        </Styles.WalletActions>

        <Link to="https://simplehold.io/how-it-works" title="How it works?" mt={41} />
        <Link to="https://simplehold.io" title="Want to migrate from another wallet?" mt={10} />
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Wallets
