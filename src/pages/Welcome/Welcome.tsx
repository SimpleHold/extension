import * as React from 'react'
import SVG from 'react-inlinesvg'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'

// Icons
import plusCircleIcon from '@assets/icons/plusCircle.svg'
import restoreIcon from '@assets/icons/restore.svg'
import askIcon from '@assets/icons/ask.svg'

// Styles
import Styles from './styles'

const Wallets: React.FC = () => {
  const history = useHistory()

  const openPage = (path: string): void => {
    history.push(path)
  }

  return (
    <Styles.Wrapper>
      <Header noActions withName logoColor="#3FBB7D" />
      <Styles.Container>
        <Styles.Title>Welcome</Styles.Title>
        <Styles.Description>
          SimpleHold would like to gather usage data to better understand how our users interact
        </Styles.Description>
        <Styles.WalletActions>
          <Styles.Action onClick={() => openPage('/wallet/create')}>
            <Styles.ActionIcon>
              <SVG src={plusCircleIcon} width={21} height={21} title="plus-circle" />
            </Styles.ActionIcon>
            <Styles.ActionName>Create new wallet</Styles.ActionName>
          </Styles.Action>
          <Styles.Action onClick={() => openPage('/wallet/restore')}>
            <Styles.ActionIcon>
              <SVG src={restoreIcon} width={20} height={20} title="restore" />
            </Styles.ActionIcon>
            <Styles.ActionName>Restore wallet</Styles.ActionName>
          </Styles.Action>
        </Styles.WalletActions>

        <Styles.Links>
          <Styles.LinkRow>
            <Styles.LinkIcon>
              <SVG src={askIcon} width={12} height={12} title="ask" />
            </Styles.LinkIcon>
            <Styles.Link>How it works?</Styles.Link>
          </Styles.LinkRow>
          <Styles.LinkRow>
            <Styles.LinkIcon>
              <SVG src={askIcon} width={12} height={12} title="ask" />
            </Styles.LinkIcon>
            <Styles.Link>Want to migrate from another wallet?</Styles.Link>
          </Styles.LinkRow>
        </Styles.Links>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Wallets
