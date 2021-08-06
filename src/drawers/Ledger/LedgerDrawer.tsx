import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

// Icons
import ErrorHardwareConnectIcon from '@assets/drawer/errorHardwareConnect.svg'
import ConnectionErrorIcon from '@assets/drawer/connectionError.svg'
import ErrorCurrencyIcon from '@assets/drawer/errorCurrency.svg'
import LedgerTxReviewIcon from '@assets/drawer/ledgerTxReview.svg'

// Config
import { getCurrency } from '@config/currencies'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  isActive: boolean
  openFrom?: string
  state: 'wrongDevice' | 'wrongApp' | 'connectionFailed' | 'reviewTx' | null
  buttonOnClick: () => void
  symbol?: string
}

const LedgerDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, openFrom, state, buttonOnClick, symbol } = props

  if (!state) {
    return null
  }

  const getCurrencyInfo = getCurrency(symbol || 'btc')

  const drawerStates = {
    wrongDevice: {
      title: 'Wrong device',
      icon: ErrorHardwareConnectIcon,
      text:
        'Connected Ledger is wrong. Please connect the correct device to confirm the transaction.',
    },
    wrongApp: {
      title: 'Wrong Ledger app',
      icon: ErrorCurrencyIcon,
      text: `Please use ${getCurrencyInfo?.name || 'Bitcoin'} app in your Ledger device`,
    },
    connectionFailed: {
      title: 'Connection failed',
      icon: ConnectionErrorIcon,
      text: 'Please check your Ledger connection and try again',
    },
    reviewTx: {
      title: 'Confirm',
      icon: LedgerTxReviewIcon,
      text: 'Please confirm your transaction on your Ledger device',
    },
  }

  const onCloseDrawer = (): void => {
    if (state !== 'reviewTx') {
      onClose()
    }
  }

  return (
    <DrawerWrapper
      title={drawerStates[state].title}
      isActive={isActive}
      onClose={onCloseDrawer}
      icon={drawerStates[state].icon}
      openFrom={openFrom}
    >
      <Styles.Row>
        <Styles.Text>{drawerStates[state].text}</Styles.Text>
        {state !== 'reviewTx' ? <Button label="Try again" onClick={buttonOnClick} mt={30} /> : null}
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default LedgerDrawer
