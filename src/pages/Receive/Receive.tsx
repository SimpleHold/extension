import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import copy from 'copy-to-clipboard'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import QRCode from '@components/QRCode'
import Button from '@components/Button'
import CopyToClipboard from '@components/CopyToClipboard'

// Drawers
import ExtraIdDrawer from '@drawers/ExtraId'

// Utils
import { getExtraIdName } from '@coins/index'
import { logEvent } from '@utils/metrics'

// Config
import { RECEIVE_COPY_ADDRESS } from '@config/events'

// Hooks
import useState from '@hooks/useState'

// Types
import { ILocationState, IState } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  isCopied: false,
  extraIdName: '',
  activeDrawer: null,
}

const ReceivePage: React.FC = () => {
  const {
    state: { address, symbol, walletName, currency, isRedirect },
  } = useLocation<ILocationState>()
  const history = useHistory()

  const { state, updateState } = useState<IState>(initialState)

  React.useEffect(() => {
    if (state.isCopied) {
      setTimeout(() => {
        updateState({ isCopied: false })
      }, 1000)
    }
  }, [state.isCopied])

  React.useEffect(() => {
    const extraIdName = getExtraIdName(symbol)

    if (extraIdName) {
      updateState({ extraIdName })
    }
  }, [])

  const onCopyAddress = (): void => {
    copy(address)
    updateState({ isCopied: true })
    logEvent({
      name: RECEIVE_COPY_ADDRESS,
    })
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const onGenerateExtraId = (): void => {
    const extraIdName = getExtraIdName(symbol)

    if (extraIdName) {
      updateState({ extraIdName, activeDrawer: 'extraId' })
    }
  }

  const onBack = () => {
    isRedirect ? history.push('/wallets') : history.goBack()
  }

  const backTitle = isRedirect ? 'Home' : walletName

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={onBack} backTitle={backTitle} whiteLogo />
        <Styles.Container>
          <Styles.Row>
            <Styles.Receive>
              <QRCode size={170} value={address} />
              <CopyToClipboard value={address}>
                <Styles.Address>{address}</Styles.Address>
              </CopyToClipboard>
            </Styles.Receive>

            <Styles.Warning>
              Send only {currency?.name} to this address. Sending any other coins may result in
              permanent loss.
            </Styles.Warning>

            {state.extraIdName?.length ? (
              <Styles.GenerateExtraId onClick={onGenerateExtraId}>
                Generate {state.extraIdName}
              </Styles.GenerateExtraId>
            ) : null}
          </Styles.Row>
          <Button label={state.isCopied ? 'Copied!' : 'Copy address'} onClick={onCopyAddress} />
        </Styles.Container>
      </Styles.Wrapper>
      <ExtraIdDrawer
        isActive={state.activeDrawer === 'extraId'}
        onClose={onCloseDrawer}
        title={state.extraIdName}
        symbol={symbol}
      />
    </>
  )
}

export default ReceivePage
