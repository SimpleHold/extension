import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Tabs from '@components/Tabs'

// Tabs
import CurrenciesTab from './tabs/currenciesTab'
import TokensTab from './tabs/tokensTab'
import HardwareTab from './tabs/hardwareTab'

// Utils
import { toLower } from '@utils/format'
import { getWallets } from '@utils/wallet'
import * as theta from '@utils/currencies/theta'
import { getUrl, openWebPage } from '@utils/extension'

// Config
import { checkExistWallet } from '@config/tokens'
import networks, { IEthNetwork } from '@config/ethLikeNetworks'

// Styles
import Styles from './styles'

const SelectCurrency: React.FC = () => {
  const history = useHistory()

  const [activeTabKey, setActiveTabKey] = React.useState<string>('currencies')

  const getWarning = (symbol: string): string | undefined => {
    if (theta.coins.indexOf(symbol) !== -1) {
      return `You are trying to add a new ${
        toLower(symbol) === 'theta' ? 'Theta' : 'TFuel'
      } address. The same address for ${
        toLower(symbol) === 'theta' ? 'TFuel' : 'Theta'
      } will also be added to your wallet.`
    }
    return undefined
  }

  const onAddAddress = (symbol: string) => (): void => {
    const warning = getWarning(symbol)

    history.push('/new-wallet', {
      symbol,
      warning,
    })
  }

  const onAddToken = (symbol: string, chain: string, tokenName: string) => (): void => {
    const walletsList = getWallets()

    if (walletsList) {
      const checkTokenWallets = checkExistWallet(walletsList, symbol, chain)

      const getNetwork = networks.find(
        (network: IEthNetwork) => toLower(network.chain) === toLower(chain)
      )

      if (getNetwork && checkTokenWallets) {
        return history.push('/add-token-to-address', {
          symbol,
          chain,
          chainName: getNetwork.name,
          tokenName,
          tokenStandart: toLower(getNetwork.chain) === 'bsc' ? 'BEP20' : 'ERC20',
        })
      }

      return history.push('/new-wallet', {
        symbol,
        chain,
      })
    }
  }

  const onAddCustomToken = (): void => {
    history.push('/add-custom-token')
  }
  const onSelectTab = (tabKey: string) => (): void => {
    setActiveTabKey(tabKey)
  }

  const onConnectHardware = (type: 'trezor' | 'ledger') => (): void => {
    if (type === 'trezor') {
      openWebPage(getUrl('connect-trezor.html'))
    }
  }

  const tabs = [
    {
      title: 'Currencies',
      key: 'currencies',
      renderItem: <CurrenciesTab onAddAddress={onAddAddress} />,
    },
    {
      title: 'Tokens',
      key: 'tokens',
      renderItem: <TokensTab onAddCustomToken={onAddCustomToken} onAddToken={onAddToken} />,
    },
    {
      title: 'Hardware',
      key: 'hardware',
      renderItem: <HardwareTab onConnect={onConnectHardware} />,
    },
  ]

  return (
    <Styles.Wrapper>
      <Cover />
      {CurrenciesTab}
      <Header withBack onBack={history.goBack} backTitle="Wallets" />
      <Styles.Container>
        <Tabs tabs={tabs} activeTabKey={activeTabKey} onSelectTab={onSelectTab} />
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default SelectCurrency
