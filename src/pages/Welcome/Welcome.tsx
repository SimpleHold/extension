import * as React from 'react'
import SVG from 'react-inlinesvg'
import { useHistory } from 'react-router-dom'
import { v4 } from 'uuid'

// Components
import Header from '@components/Header'
import Link from '@components/Link'

// Utils
import { init, logEvent } from '@utils/amplitude'
import { detectBrowser, detectOS } from '@utils/detect'
import { getUrl, openWebPage } from '@utils/extension'
import { getItem, setItem, removeItem } from '@utils/storage'
import { getPhishingSites } from '@utils/api'

// Config
import config from '@config/index'
import { WELCOME, START_CREATE, START_RESTORE, FIRST_ENTER } from '@config/events'

// Styles
import Styles from './styles'

const Wallets: React.FC = () => {
  const [isManualRestore, setManualRestore] = React.useState<boolean>(false)
  const history = useHistory()

  const os = detectOS()
  const browser = detectBrowser()

  React.useEffect(() => {
    checkManualRestore()
    initAmplitude()
    onGetPhishingSites()
  }, [])

  const onGetPhishingSites = async (): Promise<void> => {
    const data = await getPhishingSites()

    if (data?.length) {
      setItem('phishingSites', JSON.stringify(data))
    }
  }

  const checkManualRestore = () => {
    if (((os === 'macos' && browser === 'chrome') || browser === 'firefox') && !isManualRestore) {
      setManualRestore(true)
    }
  }

  const initAmplitude = (): void => {
    const clientId = getItem('clientId') || v4()

    init(config.apiKey.amplitude, clientId)

    if (!getItem('clientId')) {
      setItem('clientId', clientId)

      logEvent({
        name: FIRST_ENTER,
      })
    }

    logEvent({
      name: WELCOME,
    })
  }

  const onCreateWallet = (): void => {
    logEvent({
      name: START_CREATE,
    })

    if (getItem('manualRestoreBackup')) {
      removeItem('manualRestoreBackup')
    }

    history.push('/create-wallet')
  }

  const onRestoreWallet = () => {
    logEvent({
      name: START_RESTORE,
    })

    if (isManualRestore) {
      setItem('manualRestoreBackup', 'active')
      return openWebPage(getUrl('restore-backup.html'))
    }

    return history.push('/restore-wallet')
  }

  return (
    <Styles.Wrapper>
      <Header noActions logoColor="#3FBB7D" withBorder />
      <Styles.Container>
        <Styles.Row>
          <Styles.Title>Welcome</Styles.Title>
          <Styles.Description>
            SimpleHold is a light wallet for Bitcoin, Ethereum, and many other assets. It's never
            been easier to use crypto!
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
              <Styles.ActionName>Create a new wallet</Styles.ActionName>
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
              <Styles.ActionName>Restore your wallet</Styles.ActionName>
              {isManualRestore ? (
                <Styles.HoverActionText>The link will open in a new tab</Styles.HoverActionText>
              ) : null}
            </Styles.Action>
          </Styles.WalletActions>
        </Styles.Row>

        <Link
          to="https://simplehold.freshdesk.com/support/solutions/articles/69000197144-what-is-simplehold-"
          title="How it works?"
        />
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Wallets
