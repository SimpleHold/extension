import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import CurrencyLogo from '@components/CurrencyLogo'
import CurrenciesDropdown from '@components/CurrenciesDropdown'
import TextInput from '@components/TextInput'
import Button from '@components/Button'
import Skeleton from '@components/Skeleton'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'

// Config
import { validateContractAddress, checkExistWallet, getToken } from '@config/tokens'
import networks, { getEthNetwork, IEthNetwork } from '@config/ethLikeNetworks'
import { ICurrency, getCurrency } from '@config/currencies'

// Utils
import { getContractInfo } from '@utils/api'
import { addNew as addNewWallet, getWallets, IWallet } from '@utils/wallet'
import { toLower } from '@utils/format'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'

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

interface LocationState {
  activeNetwork?: string
  currency?: ICurrency
  address?: string
}

const AddCustomToken: React.FC = () => {
  const history = useHistory()
  const { state } = useLocation<LocationState>()

  const activeNetwork = state?.activeNetwork || undefined
  const currency = state?.currency || undefined

  const [contractAddress, setContractAddress] = React.useState<string>('')
  const [selectedNetwork, setSelectedNetwork] = React.useState<IEthNetwork>(networks[0])
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [tokenInfo, setTokenInfo] = React.useState<IToken>({
    name: '',
    symbol: '',
    decimals: 0,
  })
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [drawerErrorLabel, setDrawerErrorLabel] = React.useState<null | string>(null)
  const [logoSymbol, setLogoSymbol] = React.useState<string>(networks[0].symbol)
  const [logoBackground, setLogoBackground] = React.useState<string>('#132BD8')

  const debounced = useDebounce(contractAddress, 1000)
  const useToast = useToastContext()

  React.useEffect(() => {
    if (!errorLabel && validateContractAddress(contractAddress, selectedNetwork.chain)) {
      getContractAddressInfo()
    }
  }, [debounced])

  React.useEffect(() => {
    if (!isLoading && validateContractAddress(contractAddress, selectedNetwork.chain)) {
      getContractAddressInfo()
    }
  }, [selectedNetwork])

  React.useEffect(() => {
    if (
      typeof activeNetwork !== 'undefined' &&
      toLower(selectedNetwork.chain) !== toLower(activeNetwork)
    ) {
      const getNetworkInfo = getEthNetwork(activeNetwork)

      if (getNetworkInfo) {
        setSelectedNetwork(getNetworkInfo)

        const findCurrency = getCurrency(getNetworkInfo.symbol)

        if (findCurrency) {
          setLogoBackground(findCurrency.background)
        }
      }
    }
  }, [activeNetwork])

  const getContractAddressInfo = async (): Promise<void> => {
    setIsLoading(true)

    if (errorLabel) {
      setErrorLabel(null)
    }

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

      const checkExistToken = getToken(symbol, selectedNetwork.chain)
      setLogoSymbol(checkExistToken?.symbol || selectedNetwork.symbol)

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
    if (currency) {
      return setActiveDrawer('confirm')
    }
    const walletsList = getWallets()

    if (walletsList) {
      const { chain, name: chainName } = selectedNetwork
      const { symbol, name: tokenName } = tokenInfo

      const checkTokenWallets = checkExistWallet(walletsList, symbol, chain)

      const routeProps = {
        symbol,
        chain,
        chainName,
        tokenName,
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
    const getNetworkInfo = getEthNetwork(getNetwork.chain)

    if (getNetworkInfo) {
      setSelectedNetwork(getNetworkInfo)

      const findCurrency = getCurrency(getNetworkInfo.symbol)

      if (findCurrency) {
        setLogoBackground(findCurrency.background)
      }
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

  const onConfirmDrawer = (): void => {
    if (validatePassword(password) && currency) {
      const backup = localStorage.getItem('backup')
      if (backup) {
        const decryptBackup = decrypt(backup, password)
        if (decryptBackup && state?.address) {
          const parseBackup = JSON.parse(decryptBackup)

          const findWallet = parseBackup?.wallets?.find(
            (wallet: IWallet) => wallet.address === state.address
          )

          const walletsList = addNewWallet(
            state.address,
            findWallet.privateKey,
            decryptBackup,
            password,
            [tokenInfo.symbol],
            false,
            currency.chain,
            tokenInfo.name,
            contractAddress
          )

          if (walletsList) {
            localStorage.setItem('backupStatus', 'notDownloaded')

            return history.replace('/download-backup', {
              password,
              from: 'addCustomToken',
            })
          }
        }
      }
    }
    return setDrawerErrorLabel('Password is not valid')
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
      chain: network.chain,
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
    <>
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
                symbol={logoSymbol}
                chain={selectedNetwork.chain}
                name={tokenInfo.name || 'T'}
                background={logoBackground}
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
              label={activeNetwork ? 'Network' : 'Select network'}
              value={selectedNetwork.name}
              currencySymbol={selectedNetwork.symbol}
              list={mapList}
              onSelect={onSelectDropdown}
              currencyBr={20}
              disabled={typeof activeNetwork !== 'undefined'}
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
      <ConfirmDrawer
        isActive={activeDrawer === 'confirm'}
        onClose={() => setActiveDrawer(null)}
        title="Confirm adding new address"
        inputLabel="Enter password"
        textInputValue={password}
        isButtonDisabled={!validatePassword(password)}
        onConfirm={onConfirmDrawer}
        onChangeText={setPassword}
        textInputType="password"
        inputErrorLabel={drawerErrorLabel}
      />
    </>
  )
}

export default AddCustomToken
