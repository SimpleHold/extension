import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import copy from 'copy-to-clipboard'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import QRCode from '@components/QRCode'
import Button from '@components/Button'

// Drawers
import ExtraIdDrawer from '@drawers/ExtraId'

// Utils
import { toUpper } from '@utils/format'
import { getExtraIdName } from '@utils/address'
import { logEvent } from '@utils/amplitude'

// Config
import { ADDRESS_RECEIVE } from '@config/events'
import { getCurrency } from '@config/currencies'
import { getToken } from '@config/tokens'

// Styles
import Styles from './styles'

interface LocationState {
  address: string
  symbol: string
  walletName: string
  chain?: string
}

const ReceivePage: React.FC = () => {
  const {
    state: { address, symbol, walletName, chain },
  } = useLocation<LocationState>()
  const history = useHistory()

  const [isCopied, setIsCopied] = React.useState<boolean>(false)
  const [extraIdName, setExtraIdName] = React.useState<string>('')
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'extraId'>(null)

  const currency = chain ? getToken(symbol, chain) : getCurrency(symbol)

  React.useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }, [isCopied])

  React.useEffect(() => {
    logEvent({
      name: ADDRESS_RECEIVE,
    })

    const name = getExtraIdName(symbol)

    if (name) {
      setExtraIdName(name)
    }
  }, [])

  const onCopyAddress = (): void => {
    copy(address)
    setIsCopied(true)
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  const onGenerateExtraId = (): void => {
    const name = getExtraIdName(symbol)

    if (name) {
      setExtraIdName(name)
      setActiveDrawer('extraId')
    }
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle={walletName} />
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Receive {toUpper(symbol)}</Styles.Title>

            <Styles.Receive>
              <QRCode size={170} value={address} />
              <Styles.Address>{address}</Styles.Address>
            </Styles.Receive>

            <Styles.Warning>
              Send only {currency?.name} to this address. Sending any other coins may result in
              permanent loss.
            </Styles.Warning>

            {extraIdName?.length ? (
              <Styles.GenerateExtraId onClick={onGenerateExtraId}>
                Generate {extraIdName}
              </Styles.GenerateExtraId>
            ) : null}
          </Styles.Row>
          <Button label={isCopied ? 'Copied!' : 'Copy address'} onClick={onCopyAddress} />
        </Styles.Container>
      </Styles.Wrapper>
      <ExtraIdDrawer
        isActive={activeDrawer === 'extraId'}
        onClose={onCloseDrawer}
        title={extraIdName}
        symbol={symbol}
      />
    </>
  )
}

export default ReceivePage
