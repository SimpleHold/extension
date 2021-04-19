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
import { validateContractAddress, checkExistWallet } from '@config/tokens'
import networks, { getEthNetwork, IEthNetwork } from '@config/ethLikeNetworks'

// Utils
import { getContractInfo } from '@utils/api'
import { getWallets } from '@utils/wallet'

// Hooks
import useDebounce from '@hooks/useDebounce'
import useToastContext from '@hooks/useToastContext'

// Styles
import Styles from './styles'

interface IToken {
  name: string
  symbol: string
  decimals: number
}

const AddCustomToken: React.FC = () => {
  const history = useHistory()

  const [contractAddress, setContractAddress] = React.useState<string>('')
  const [selectedNetwork, setSelectedNetwork] = React.useState<IEthNetwork>(networks[0])
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [tokenInfo, setTokenInfo] = React.useState<IToken>({
    name: '',
    symbol: '',
    decimals: 0,
  })

  const debounced = useDebounce(contractAddress, 1000)
  const useToast = useToastContext()

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

    if (tokenInfo.name.length || tokenInfo.symbol.length || tokenInfo.decimals > 0) {
      setTokenInfo({
        name: '',
        symbol: '',
        decimals: 0,
      })
    }

    const data = await getContractInfo(contractAddress, selectedNetwork.chain)

    setIsLoading(false)

    if (data) {
      const { name, symbol, decimals } = data

      setTokenInfo({
        name,
        symbol,
        decimals,
      })
    } else {
      useToast('Token Contract Address is not found')
    }
  }

  const onConfirm = (): void => {
    const walletsList = getWallets()

    if (walletsList) {
      const { symbol, chain } = selectedNetwork

      const checkTokenWallets = checkExistWallet(walletsList, symbol, chain)

      const routeProps = {
        symbol,
        chain,
        chainName: selectedNetwork.name,
        tokenName: tokenInfo.name,
        contractAddress,
      }

      if (checkTokenWallets) {
        return history.push('/add-token-to-address', routeProps)
      }

      return history.push('/new-wallet', routeProps)
    }
  }

  const onSelectDropdown = (index: number): void => {
    const getNetwork = mapList[index]
    const getNetworkInfo = getEthNetwork(getNetwork.logo.symbol)

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

  const onChangeAddress = (value: string): void => {
    if (!isLoading) {
      setContractAddress(value)
    }
  }

  const dropDownList = networks.filter(
    (network: IEthNetwork) => network.symbol !== selectedNetwork.symbol
  )

  const mapList = dropDownList.map((network: IEthNetwork) => {
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
    !tokenInfo.name.length ||
    !tokenInfo.symbol.length ||
    tokenInfo.decimals <= 0 ||
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
              symbol={selectedNetwork.symbol}
              chain={selectedNetwork.chain}
              name={tokenInfo.name || 'T'}
              background="#132BD8"
            />
            <Styles.TokenCardRow>
              <Skeleton width={90} height={19} mt={6} isLoading={isLoading} type="gray">
                <Styles.TokenName>{tokenInfo.name || 'Token name'}</Styles.TokenName>
              </Skeleton>
              <Skeleton width={40} height={15} mt={4} isLoading={isLoading} type="gray">
                <Styles.TokenSymbol>{tokenInfo.symbol || 'Ticker'}</Styles.TokenSymbol>
              </Skeleton>
              <Styles.DecimalRow>
                <Styles.TokenDecimalLabel>Decimals of precion:</Styles.TokenDecimalLabel>
                <Skeleton width={20} height={14} mt={0} isLoading={isLoading} type="gray">
                  {tokenInfo.decimals > 0 ? (
                    <Styles.TokenDecimal>{tokenInfo.decimals}</Styles.TokenDecimal>
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
            onChange={onChangeAddress}
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
