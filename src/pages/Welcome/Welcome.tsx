import * as React from 'react'
import SVG from 'react-inlinesvg'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import Link from '@components/Link'

// Utils
import { logEvent } from '@utils/amplitude'
import { detectBrowser, detectOS } from '@utils/detect'
import { getUrl, openWebPage } from '@utils/extension'

// Config
import { WELCOME, START_CREATE, START_RESTORE } from '@config/events'

// Styles
import Styles from './styles'

const Wallets: React.FC = () => {
  const [isManualRestore, setManualRestore] = React.useState<boolean>(false)
  const history = useHistory()

  const os = detectOS()
  const browser = detectBrowser()

  React.useEffect(() => {
    logEvent({
      name: WELCOME,
    })

    checkManualRestore()
  }, [])

  const checkManualRestore = () => {
    if (((os === 'macos' && browser === 'chrome') || browser === 'firefox') && !isManualRestore) {
      setManualRestore(true)
    }
  }

  const onCreateWallet = (): void => {
    logEvent({
      name: START_CREATE,
    })

    if (localStorage.getItem('manualRestoreBackup')) {
      localStorage.removeItem('manualRestoreBackup')
    }

    history.push('/create-wallet')
  }

  const onRestoreWallet = () => {
    logEvent({
      name: START_RESTORE,
    })

    if (isManualRestore) {
      localStorage.setItem('manualRestoreBackup', 'active')
      return openWebPage(getUrl('restore-backup.html'))
    }

    return history.push('/restore-wallet')
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
            {isManualRestore ? (
              <Styles.HoverActionText>The link will open in a new tab</Styles.HoverActionText>
            ) : null}
          </Styles.Action>
        </Styles.WalletActions>

        <Link
          to="https://simplehold.freshdesk.com/support/solutions/articles/69000197144-what-is-simplehold-"
          title="How it works?"
          mt={41}
        />
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Wallets
