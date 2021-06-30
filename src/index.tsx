import * as React from 'react'
import { render } from 'react-dom'
import { MemoryRouter as Router } from 'react-router-dom'
import { v4 } from 'uuid'

// Styles
import GlobalStyles from './styles/global'

// Config
import config from '@config/index'
import { FIRST_ENTER, SESSION_START } from '@config/events'

// Utils
import { validateWallet } from '@utils/validate'
import { init, logEvent } from '@utils/amplitude'
import { getItem, setItem } from '@utils/storage'

// Contexts
import { ToastContextProvider } from '@contexts/Toast/Toast'

import App from './app'

const Popup: React.FC = () => {
  React.useEffect(() => {
    initAmplitude()
  }, [])

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
      name: SESSION_START,
    })
  }

  const getInitialPage = (): string => {
    if (getItem('isLocked')) {
      return getItem('passcode') !== null ? '/enter-passcode' : '/lock'
    }
    if (getItem('onBoard') !== 'passed') {
      return '/onboard'
    }

    if (getItem('analytics') !== 'agreed') {
      return '/analytics-data'
    }

    if (getItem('backupStatus') === 'notDownloaded') {
      return '/download-backup'
    }

    const validateWallets = validateWallet(getItem('wallets'))
    return validateWallets ? '/wallets' : '/welcome'
  }

  return (
    <>
      <GlobalStyles />
      <ToastContextProvider>
        <Router initialEntries={[getInitialPage()]}>
          <App />
        </Router>
      </ToastContextProvider>
    </>
  )
}

render(<Popup />, document.getElementById('popup-root'))
