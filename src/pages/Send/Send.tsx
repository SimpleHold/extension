import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import SendForm from './components/SendForm'

// Drawers
import WalletsDrawer from '@drawers/Wallets'

// Utils
import { toLower, toUpper } from '@utils/format'
import { getBalance } from '@utils/api'
import { THardware, updateBalance, getWallets, IWallet } from '@utils/wallet'

// Config
import { getCurrency } from '@config/currencies'
import { getToken } from '@config/tokens'

// Styles
import Styles from './styles'

interface LocationState {
  symbol: string
  address: string
  walletName: string
  chain?: string
  contractAddress?: string
  hardware?: THardware
}

const SendPage: React.FC = () => {
  const {
    state,
    state: { symbol, chain, contractAddress },
  } = useLocation<LocationState>()
  const history = useHistory()

  const [balance, setBalance] = React.useState<number | null>(null)
  const [estimated, setEstimated] = React.useState<number | null>(null)
  const [selectedAddress, setSelectedAddress] = React.useState<string>(state.address)
  const [wallets, setWallets] = React.useState<IWallet[]>([])
  const [activeDrawer, setActiveDrawer] = React.useState<'wallets' | null>(null)
  const [walletName, setWalletName] = React.useState<string>(state.walletName)
  const [hardware, setHardware] = React.useState<THardware | undefined>(state.hardware)
  const [destination, setDestination] = React.useState<string>('')

  const currency = chain ? getToken(symbol, chain) : getCurrency(symbol)

  React.useEffect(() => {
    getWalletsList()
  }, [])

  React.useEffect(() => {
    loadBalance()
  }, [selectedAddress])

  const loadBalance = async (): Promise<void> => {
    const { balance, balance_usd, balance_btc } = await getBalance(
      selectedAddress,
      currency?.chain || chain,
      chain ? symbol : undefined,
      contractAddress
    )

    setBalance(balance)
    updateBalance(selectedAddress, symbol, balance, balance_btc)
    setEstimated(balance_usd)
  }

  const getWalletsList = (): void => {
    const walletsList = getWallets()

    if (walletsList) {
      const filterWallets = walletsList.filter(
        (wallet: IWallet) =>
          toLower(wallet.symbol) === toLower(symbol) && toLower(wallet.chain) === toLower(chain)
      )
      setWallets(filterWallets)
    }
  }

  const onCancel = (): void => {
    history.goBack()
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  const openWalletsDrawer = (): void => {
    setActiveDrawer('wallets')
  }

  const onClickDrawerWallet = (address: string) => (): void => {
    setDestination(address)
    setActiveDrawer(null)
  }

  const changeWallet = (address: string, name: string, hardware?: THardware) => {
    setSelectedAddress(address)
    setWalletName(name)
    setHardware(hardware)
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle={`${currency?.name} wallet`} />
        <Styles.Container>
          <Styles.Title>Send {toUpper(symbol)}</Styles.Title>
          <SendForm
            symbol={symbol}
            onCancel={onCancel}
            balance={balance}
            estimated={estimated}
            hardware={hardware}
            walletName={walletName}
            address={selectedAddress}
            openWalletsDrawer={openWalletsDrawer}
            wallets={wallets}
            selectedAddress={selectedAddress}
            changeWallet={changeWallet}
            destination={{
              value: destination,
              onChange: setDestination,
            }}
          />
        </Styles.Container>
      </Styles.Wrapper>
      <WalletsDrawer
        isActive={activeDrawer === 'wallets'}
        onClose={onCloseDrawer}
        selectedAddress={selectedAddress}
        wallets={wallets}
        onClickWallet={onClickDrawerWallet}
      />
    </>
  )
}

export default SendPage
