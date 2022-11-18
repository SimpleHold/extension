import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Tabs from '@components/Tabs'

// Tabs
import AllTab from './tabs/allTab'
import CurrenciesTab from './tabs/currenciesTab'
import TokensTab from './tabs/tokensTab'
import HardwareTab from './tabs/hardwareTab'

// Utils
import { toLower } from '@utils/format'
import { getWallets } from '@utils/wallet'
import { getUrl, openWebPage } from '@utils/extension'
import { getStandart } from '@tokens/index'

// Coins
import { config as thetaConfig } from '@coins/theta'
import { config as vechainConfig } from '@coins/vechain'

// Tokens
import { getSharedTokens } from '@tokens/index'

// Config
import tokens, { checkExistWallet } from '@tokens/index'
import networks, { TNetwork } from '@config/networks'
import { TToken } from '@tokens/types'

// Styles
import Styles from './styles'

const SelectCurrency: React.FC = () => {
  const history = useHistory()

  const [activeTabKey, setActiveTabKey] = React.useState<string>('all')
  const [tokensList, setTokensList] = React.useState<TToken[]>(tokens)

  React.useEffect(() => {
    checkLocalTokens()
  }, [])

  const checkLocalTokens = (): void => {
    const localTokens = getSharedTokens()

    if (localTokens.length) {
      setTokensList((prev: TToken[]) => [...prev, ...localTokens])
    }
  }

  const getWarning = (symbol: string): string | undefined => {
    if (thetaConfig.coins.indexOf(symbol) !== -1) {
      return `You are trying to add a new ${
        toLower(symbol) === 'theta' ? 'Theta' : 'TFuel'
      } address. The same address for ${
        toLower(symbol) === 'theta' ? 'TFuel' : 'Theta'
      } will also be added to your wallet.`
    } else if (vechainConfig.coins.indexOf(symbol) !== -1) {
      return `You are trying to add a new ${
        toLower(symbol) === 'vet' ? 'VeChain' : 'VeThor'
      } address. The same address for ${
        toLower(symbol) === 'vet' ? 'VeThor' : 'VeChain'
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
        (network: TNetwork) => toLower(network.chain) === toLower(chain)
      )

      if (getNetwork && checkTokenWallets) {
        return history.push('/add-token-to-address', {
          symbol,
          chain,
          chainName: getNetwork.name,
          tokenName,
          tokenStandart: getStandart(toLower(getNetwork.chain)),
        })
      }

      return history.push('/new-wallet', {
        symbol,
        chain,
        tokenName,
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
    } else {
      openWebPage(getUrl('connect-ledger.html'))
    }
  }

  const tabs = [
    {
      title: 'All',
      key: 'all',
      renderItem: (
        <AllTab
          onAddCustomToken={onAddCustomToken}
          onAddToken={onAddToken}
          onAddAddress={onAddAddress}
          tokens={tokensList}
        />
      ),
    },
    {
      title: 'Currencies',
      key: 'currencies',
      renderItem: <CurrenciesTab onAddAddress={onAddAddress} />,
    },
    {
      title: 'Tokens',
      key: 'tokens',
      renderItem: (
        <TokensTab
          onAddCustomToken={onAddCustomToken}
          onAddToken={onAddToken}
          tokens={tokensList}
        />
      ),
    },
    {
      title: 'Hardware',
      key: 'hardware',
      renderItem: <HardwareTab onConnect={onConnectHardware} />,
    },
  ]

  return (
    <Styles.Wrapper>
      <>
        <Cover />
        {CurrenciesTab}
        <Header withBack onBack={history.goBack} backTitle="Wallets" whiteLogo />
        <Styles.Container>
          <Tabs tabs={tabs} activeTabKey={activeTabKey} onSelectTab={onSelectTab} />
        </Styles.Container>
      </>
    </Styles.Wrapper>
  )
}

export default SelectCurrency
