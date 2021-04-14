import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import CurrencyLogo from '@components/CurrencyLogo'
import CurrenciesDropdown from '@components/CurrenciesDropdown'
import TextInput from '@components/TextInput'
import Button from '@components/Button'
import Skeleton from '@components/Skeleton'

// Config
import { validateContractAddress } from '@config/tokens'

// Utils
import { getContractInfo } from '@utils/api'
import { getWallets, IWallet } from '@utils/wallet'
import { toLower } from '@utils/format'

// Hooks
import useDebounce from '@hooks/useDebounce'

// Styles
import Styles from './styles'

interface INetwork {
  name: string
  symbol: string
  chain: string
}

const networks: INetwork[] = [
  {
    name: 'Ethereum',
    symbol: 'eth',
    chain: 'eth',
  },
  {
    name: 'Binance',
    symbol: 'bnb',
    chain: 'bsc',
  },
]

const AddCustomToken: React.FC = () => {
  const history = useHistory()

  const [contractAddress, setContractAddress] = React.useState<string>('')
  const [selectedNetwork, setSelectedNetwork] = React.useState<INetwork>(networks[0])
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [tokenName, setTokenName] = React.useState<string>('')
  const [tokenSymbol, setTokenSymbol] = React.useState<string>('')
  const [tokenDecimals, setTokenDecimals] = React.useState<number>(0)

  const debounced = useDebounce(contractAddress, 1000)

  React.useEffect(() => {
    if (
      contractAddress.length &&
      !errorLabel &&
      validateContractAddress(contractAddress, selectedNetwork.chain)
    ) {
      getContractAddressInfo()
    }
  }, [debounced])

  const getContractAddressInfo = async (): Promise<void> => {
    setIsLoading(true)

    if (tokenName.length) {
      setTokenName('')
    }

    if (tokenSymbol.length) {
      setTokenSymbol('')
    }

    if (tokenDecimals > 0) {
      setTokenDecimals(0)
    }

    const data = await getContractInfo(contractAddress, selectedNetwork.chain)

    setIsLoading(false)

    if (data) {
      const { name, symbol, decimals } = data

      setTokenName(name)
      setTokenSymbol(symbol)
      setTokenDecimals(decimals)
    } else {
      // Fix me: handle not found
    }
  }

  const onConfirm = (): void => {
    const walletsList = getWallets()
    const { symbol, chain } = selectedNetwork

    const checkExistWallet = walletsList?.filter(
      (wallet: IWallet) =>
        toLower(wallet.chain) === toLower(chain) && toLower(wallet.symbol) === toLower(symbol)
    )
    const getAllWalletsByChain = walletsList?.filter(
      (wallet: IWallet) => toLower(wallet.symbol) === toLower(chain)
    )

    if (checkExistWallet?.length && getAllWalletsByChain?.length === 1) {
      return history.push('/new-wallet', {
        symbol: chain,
      })
    }

    return history.push('/add-token-to-address', {
      symbol,
      chain,
    })
  }

  const onSelectDropdown = (index: number): void => {
    const getNetwork = mapList[index]
    const getNetworkInfo = networks.find(
      (network: INetwork) => network.symbol === getNetwork.logo.symbol
    )

    if (getNetworkInfo) {
      setSelectedNetwork(getNetworkInfo)
    }
  }

  const onBlurInput = (): void => {
    if (!validateContractAddress(contractAddress, selectedNetwork.chain)) {
      setErrorLabel('Token Contract Address is not valid')
    } else {
      if (errorLabel) {
        setErrorLabel(null)
      }
    }
  }

  const dropDownList = networks.filter(
    (network: INetwork) => network.symbol !== selectedNetwork.symbol
  )

  const mapList = dropDownList.map((network: INetwork) => {
    return {
      logo: {
        symbol: network.symbol,
        width: 40,
        height: 40,
        br: 20,
        background: '#1D1D22',
      },
      value: network.name,
    }
  })

  const isButtonDisabled =
    !tokenName.length ||
    !tokenSymbol.length ||
    tokenDecimals <= 0 ||
    !contractAddress.length ||
    isLoading ||
    errorLabel !== null

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={history.goBack} backTitle="Select currency" />
      <Styles.Container>
        <Styles.Row>
          <Styles.Title>Add custom token</Styles.Title>

          <Styles.TokenCard>
            <CurrencyLogo
              width={40}
              height={40}
              symbol={tokenSymbol}
              chain={selectedNetwork.chain}
              letter={tokenName[0]}
            />
            <Styles.TokenCardRow>
              <Skeleton width={90} height={19} mt={6} isLoading={isLoading} type="gray">
                <Styles.TokenName>{tokenName || 'Token name'}</Styles.TokenName>
              </Skeleton>
              <Skeleton width={40} height={15} mt={4} isLoading={isLoading} type="gray">
                <Styles.TokenSymbol>{tokenSymbol || 'Ticker'}</Styles.TokenSymbol>
              </Skeleton>
              <Styles.DecimalRow>
                <Styles.TokenDecimalLabel>Decimals of precion:</Styles.TokenDecimalLabel>
                <Skeleton width={20} height={14} mt={0} isLoading={isLoading} type="gray">
                  {tokenDecimals > 0 ? (
                    <Styles.TokenDecimal>{tokenDecimals}</Styles.TokenDecimal>
                  ) : null}
                </Skeleton>
              </Styles.DecimalRow>
            </Styles.TokenCardRow>
          </Styles.TokenCard>
        </Styles.Row>

        <Styles.Form>
          <CurrenciesDropdown
            label="Select network"
            value={selectedNetwork.name}
            currencySymbol={selectedNetwork.symbol}
            list={mapList}
            onSelect={onSelectDropdown}
            currencyBr={20}
          />
          <TextInput
            label="Token Contract Address"
            value={contractAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setContractAddress(e.target.value)
            }
            onBlurInput={onBlurInput}
            errorLabel={errorLabel}
          />
          <Styles.ButtonRow>
            <Button label="Confirm" disabled={isButtonDisabled} onClick={onConfirm} />
          </Styles.ButtonRow>
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default AddCustomToken
