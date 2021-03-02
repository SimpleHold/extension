import * as React from 'react'
import SVG from 'react-inlinesvg'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import Link from '@components/Link'

// Icons
import plusCircleIcon from '@assets/icons/plusCircle.svg'
import restoreIcon from '@assets/icons/restore.svg'

// Styles
import Styles from './styles'

const Wallets: React.FC = () => {
  const history = useHistory()

  const openPage = (path: string): void => {
    history.push(path)
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
          <Styles.Action onClick={() => openPage('/create-wallet')}>
            <Styles.ActionIcon>
              <SVG src={plusCircleIcon} width={20} height={20} title="plus-circle" />
            </Styles.ActionIcon>
            <Styles.ActionName>Create new wallet</Styles.ActionName>
          </Styles.Action>
          <Styles.Action onClick={() => openPage('/restore-wallet')}>
            <Styles.ActionIcon>
              <SVG src={restoreIcon} width={20} height={20} title="restore" />
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
