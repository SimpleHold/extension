import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'

// Containers
import EnterAddressContainer from '@containers/EnterAddress'

// Drawers
import WalletsDrawer from '@drawers/Wallets'

// Store
import { useSendStore } from '@store/send/store'

// Utils
import { logEvent } from '@utils/metrics'

// Config
import * as events from '@config/events'

// Styles
import Styles from './styles'

const EnterAddress: React.FC = () => {
  const [address, setAddress] = React.useState<string>('')
  const [memo, setMemo] = React.useState<string>('')
  const [activeDrawer, setActiveDrawer] = React.useState<'wallets' | null>(null)
  const [feeEstimated, setFeeEstimated] = React.useState<number>(0)

  const history = useHistory()
  const { wallet, drawerWallets, amount: storeAmount } = useSendStore()

  const [amount, setAmount] = React.useState<string>(storeAmount)

  const onNext = (): void => {
    logEvent({
      name: events.SEND_RECIPIENT_ADDRESS,
    })

    history.push('/send-confirm', {
      address,
      memo,
      feeEstimated,
      amount,
    })
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  const onClickWallet = (address: string) => (): void => {
    setAddress(address)
    setActiveDrawer(null)
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Home" whiteLogo />
        <Styles.Container>
          <EnterAddressContainer
            onBack={history.goBack}
            onNext={onNext}
            setActiveDrawer={setActiveDrawer}
            setFeeEstimated={setFeeEstimated}
            amount={amount}
            setAmount={setAmount}
            address={address}
            setAddress={setAddress}
            memo={memo}
            setMemo={setMemo}
          />
        </Styles.Container>
      </Styles.Wrapper>
      <WalletsDrawer
        isActive={activeDrawer === 'wallets'}
        onClose={onCloseDrawer}
        wallets={drawerWallets}
        onClickWallet={onClickWallet}
        selectedAddress={wallet?.address}
      />
    </>
  )
}

export default observer(EnterAddress)
