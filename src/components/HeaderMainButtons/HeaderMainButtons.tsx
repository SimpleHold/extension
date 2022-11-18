import * as React from 'react'
import { CSSTransition } from 'react-transition-group'

// Config
import { EXCHANGE_SELECT } from '@config/events'

// Assets
import sendIcon from '@assets/icons/sendIconMainNew.svg'
import receiveIcon from '@assets/icons/receiveIconMainNew.svg'
import swapIcon from '@assets/icons/swapIconMainNew.svg'

// Utils
import { openWebPage } from '@utils/extension'
import { logEvent } from '@utils/metrics'

// Styles
import Styles from './styles'

type TProps = {
  onClickReceive: () => void
  onClickSend: () => void
  isCollapsed?: boolean
}

const HeaderMainButtons: React.FC<TProps> = ({ isCollapsed, onClickSend, onClickReceive }) => {
  const onClickSwap = (): void => {
    logEvent({
      name: EXCHANGE_SELECT,
    })

    openWebPage('https://simpleswap.io/?ref=2a7607295184')
  }

  return (
    <Styles.Animations>
      <CSSTransition in={isCollapsed} timeout={400} classNames={'buttons'} unmountOnExit>
        <Styles.Container>
          <Styles.Button onClick={onClickSend}>
            <Styles.Icon src={sendIcon} />
            <Styles.Label>Send</Styles.Label>
          </Styles.Button>
          <Styles.Button onClick={onClickReceive}>
            <Styles.Icon src={receiveIcon} />
            <Styles.Label>Receive</Styles.Label>
          </Styles.Button>
          <Styles.Button onClick={onClickSwap}>
            <Styles.Icon src={swapIcon} />
            <Styles.Label>Swap</Styles.Label>
          </Styles.Button>
        </Styles.Container>
      </CSSTransition>
    </Styles.Animations>
  )
}

export default HeaderMainButtons
