import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { v4 } from 'uuid'

// Components
import Header from '@components/Header'
import Button from '@components/Button'

// Config
import { FIRST_ENTER, ONBOARDING, START_CREATE, START_RESTORE, WELCOME } from '@config/events'
import config from 'config'

// Assets
import illustrate from '@assets/illustrate/onboardingIllustration.svg'

// SwapSpace
import swapSpaceIllustrate from '@assets/theme/swapspace/1.svg'

// Utils
import { init, logEvent } from '@utils/amplitude'
import { getItem, removeItem, setItem } from '@utils/storage'
import { getAllCookies, Cookie, openWebPage, getUrl } from '@utils/extension'
import { toLower } from '@utils/format'
import { detectBrowser, detectOS } from '@utils/detect'
import { getPhishingSites } from '@utils/api'

// Styles
import Styles from './styles'

type TTheme = {
  [key: string]: {
    image: string
    title: string
    description: string
  }[]
}

const themes: TTheme = {
  simplehold: [
    {
      image: illustrate,
      title: 'Welcome to SimpleHold Wallet!',
      description:
        'SimpleHold is your gate to cryptocurrency holdings. Store, send, receive and exchange safely and easily with SimpleHold!',
    },
  ],
  swapspace: [
    {
      image: swapSpaceIllustrate,
      title: 'Hello!',
      description:
        'Welcome to the SimpleHold crypto wallet! We are glad that you come here from SwapSpace as it is our reliable partner.',
    },
  ],
}

const WelcomeNew: React.FC = () => {
  const history = useHistory()

  const [theme, setTheme] = React.useState<'simplehold' | 'swapspace'>('simplehold')
  const [isManualRestore, setManualRestore] = React.useState<boolean>(false)

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

  React.useEffect(() => {
    getCookies()
  }, [])

  React.useEffect(() => {
    logEvent({
      name: ONBOARDING,
    })
  }, [])

  const getCookies = async () => {
    const cookies = await getAllCookies('https://simplehold.io')

    const getRef = cookies.find((cookie: Cookie) => cookie.name === 'ref')

    if (getRef) {
      const { value } = getRef

      if (toLower(value) === 'swapspace') {
        setTheme('swapspace')
      }
    }
  }

  return (
    <Styles.Wrapper theme={theme}>
      <Header
        noActions
        withBorder
        borderColor={theme === 'swapspace' ? 'rgba(234, 234, 234, 0.2)' : undefined}
        isAbsolute
      />
      <Styles.Container className='container'>
        <Styles.Row>
          <Styles.Illustrate
            className='slide'
            src={themes[theme][0].image}
            alt='illustrate'
          />
          <Styles.Title className='title'>{themes[theme][0].title}</Styles.Title>
          <Styles.Description className='description'>
            {themes[theme][0].description}
          </Styles.Description>
        </Styles.Row>
        <Styles.Footer>
          <Styles.Buttons>
            <Button label={'Create new wallet'} onClick={onCreateWallet} />
            <Styles.RestoreButtonContainer>
              <Button label={'Restore'} onClick={onRestoreWallet} />
              {isManualRestore ? (
                <Styles.HoverActionText className={'action-text'}>The link will open in a new tab</Styles.HoverActionText>
              ) : null}
            </Styles.RestoreButtonContainer>
          </Styles.Buttons>
        </Styles.Footer>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default WelcomeNew
