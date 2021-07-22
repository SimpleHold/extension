import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'
import copy from 'copy-to-clipboard'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import QRCode from '@components/QRCode'
import Button from '@components/Button'

// Utils
import { toUpper } from '@utils/format'

// Assets
import moreIcon from '@assets/icons/more.svg'

// Styles
import Styles from './styles'

interface LocationState {
  address: string
  symbol: string
  chain?: string
}

const ReceivePage: React.FC = () => {
  const {
    state: { address, symbol, chain = undefined },
  } = useLocation<LocationState>()
  const history = useHistory()

  const [isCopied, setIsCopied] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }, [isCopied])

  const onCopyAddress = (): void => {
    copy(address)
    setIsCopied(true)
  }

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={history.goBack} backTitle="Wallet" />
      <Styles.Container>
        <Styles.Row>
          <Styles.Heading>
            <Styles.Button />
            <Styles.Title>Receive {toUpper(symbol)}</Styles.Title>
            <Styles.MoreButton>
              <SVG src={moreIcon} width={16} height={3.36} />
            </Styles.MoreButton>
          </Styles.Heading>

          <Styles.Receive>
            <QRCode size={170} value={address} />
            <Styles.Address>{address}</Styles.Address>
          </Styles.Receive>

          <Styles.Warning>
            Send only Bitcoin to this address. Sending any other coins may result in permanent loss.
          </Styles.Warning>
        </Styles.Row>
        <Button label={isCopied ? 'Copied!' : 'Copy address'} onClick={onCopyAddress} isSmall />
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default ReceivePage
