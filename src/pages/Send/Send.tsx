import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'

// Containers
import SendContainer from '@containers/Send'

// Drawers
import NetworkFeeDrawer from '@drawers/NetworkFee'
import WalletsDrawer from '@drawers/Wallets'
import InsufficientFeeDrawer from '@drawers/InsufficientFee'

// Store
import { useSendStore } from '@store/send/store'

// Utils
import { toLower } from '@utils/format'
import { logEvent } from '@utils/metrics'

// Config
import * as events from '@config/events'

// Types
import { IWallet, THardware } from '@utils/wallet'
import { TCurrency } from '@config/currencies/types'
import { TToken } from '@tokens/types'
import { TFee } from '@utils/api/types'

// Styles
import Styles from './styles'

interface ILocationState {
  symbol: string
  address: string
  chain: string
  walletName: string
  tokenChain?: string
  contractAddress?: string
  tokenName?: string
  decimals?: number
  hardware: THardware
  currency: TCurrency | TToken
  isRedirect?: boolean
  wallet: IWallet
}

const SendPage: React.FC = () => {
  const { state } = useLocation<ILocationState>()
  const history = useHistory()

  const {
    activeDrawer,
    setActiveDrawer,
    setWallet,
    wallet,
    drawerWallets,
    fees,
    feeSymbol,
    setFeeType,
    setFee,
    fee,
    isCurrencyBalanceError,
    feeType,
  } = useSendStore()

  React.useEffect(() => {
    setWallet(state.wallet)
  }, [])

  const onBack = () => {
    state.isRedirect ? history.push('/wallets') : history.goBack()
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  const onNext = (): void => {
    logEvent({
      name: events.SEND_ENTERED_AMOUNT,
    })

    history.push('/enter-address')
  }

  const onClickWallet = (address: string) => (): void => {
    setActiveDrawer(null)

    if (toLower(wallet?.address) !== toLower(address)) {
      const findWallet = drawerWallets.find((item) => toLower(item.address) === toLower(address))

      if (findWallet) {
        setWallet(findWallet)

        logEvent({
          name: events.SEND_SELECT_WALLET,
          properties: {
            symbol: findWallet.symbol,
          },
        })
      }
    }
  }

  const onSelectFee = (data: TFee): void => {
    setActiveDrawer(null)

    const getValue = fees.find((item: TFee) => item.type === data.type)

    setFeeType(data.type)
    setFee(getValue?.value || 0)
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={onBack} backTitle="Home" whiteLogo />
        <Styles.Container>
          <SendContainer onNext={onNext} symbol={wallet?.symbol || ''} onBack={onBack} />
        </Styles.Container>
      </Styles.Wrapper>
      <NetworkFeeDrawer
        isActive={activeDrawer === 'networkFee'}
        onClose={onCloseDrawer}
        fees={fees}
        symbol={feeSymbol}
        onSelect={onSelectFee}
        activeFeeType={feeType}
        isCurrencyBalanceError={isCurrencyBalanceError}
        fee={fee}
      />
      <WalletsDrawer
        isActive={activeDrawer === 'wallets'}
        onClose={onCloseDrawer}
        wallets={drawerWallets}
        onClickWallet={onClickWallet}
        selectedAddress={wallet?.address}
      />
      {wallet ? (
        <InsufficientFeeDrawer
          isActive={activeDrawer === 'insufficientFee'}
          onClose={onCloseDrawer}
          value={fee}
          symbol={feeSymbol}
          wallet={wallet}
        />
      ) : null}
    </>
  )
}

export default observer(SendPage)
