import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

// Utils
import { IWallet } from '@utils/wallet'
import { toUpper } from '@utils/format'

// Config
import { getCurrencyInfo } from '@config/currencies/utils'

// Assets
import failIcon from '@assets/drawer/fail.svg'

// Tokens
import { getToken } from '@tokens/index'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
  onClose: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  value: number
  symbol: string
  wallet: IWallet
}

const InsufficientFeeDrawer: React.FC<Props> = (props) => {
  const { isActive, onClose, value, wallet } = props

  const coinInfo = wallet.chain
    ? getToken(wallet.symbol, wallet.chain)
    : getCurrencyInfo(wallet.symbol)
  const symbol = coinInfo?.chain === 'oeth' ? 'oeth' : props.symbol

  return (
    <DrawerWrapper
      isActive={isActive}
      onClose={onClose}
      padding="24px 28px"
      icon={failIcon}
      hideStrandgeDiv
    >
      <Styles.Row>
        <Styles.Title>Insufficient Fee</Styles.Title>
        {symbol === 'xrp' ? (
          <Styles.Text>
            The network requires at least <Styles.TextBold>20 XRP</Styles.TextBold> balance at all
            times
          </Styles.Text>
        ) : (
          <Styles.Text>
            You need{' '}
            <Styles.TextBold>
              {value} {toUpper(symbol)}
            </Styles.TextBold>{' '}
            to make a transfer. Your balance is currently insufficient to make an exchange
          </Styles.Text>
        )}

        <Button label="Got it" mt={24} onClick={onClose} />
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default InsufficientFeeDrawer
