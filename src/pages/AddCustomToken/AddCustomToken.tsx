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
import { getCurrency } from '@config/currencies'

// Utils
import { getContractInfo } from '@utils/api'
import { addNew as addNewWallet, getWallets, IWallet } from '@utils/wallet'
import { toLower } from '@utils/format'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { getItem, setItem } from '@utils/storage'
import { getTokenStandart } from '@utils/currencies'

// Hooks
import useDebounce from '@hooks/useDebounce'
import useToastContext from '@hooks/useToastContext'
import useState from '@hooks/useState'

// Types
import { IToken, ILocationState, IState } from './types'

// Styles
import Styles from './styles'

const initialToken: IToken = {
  name: '',
  symbol: '',
  decimals: 0,
}

const initialState: IState = {
  contractAddress: '',
  selectedNetwork: networks[0],
  errorLabel: null,
  isLoading: false,
  tokenInfo: initialToken,
  activeDrawer: null,
  password: '',
  drawerErrorLabel: null,
  logoSymbol: networks[0].symbol,
  logoBackground: '#132BD8',
}

const AddCustomToken: React.FC = () => {
  const history = useHistory()
  const { state: locationState } = useLocation<ILocationState>()
  const { state, updateState } = useState<IState>(initialState)
  const debounced = useDebounce(state.contractAddress, 1000)
  const useToast = useToastContext()

  const activeNetwork = locationState?.activeNetwork || undefined
  const currency = locationState?.currency || undefined

  React.useEffect(() => {
    if (
      !state.errorLabel &&
      validateContractAddress(state.contractAddress, state.selectedNetwork.chain)
    ) {
      getContractAddressInfo()
    }
  }, [debounced])

  React.useEffect(() => {
    if (
      !state.isLoading &&
      validateContractAddress(state.contractAddress, state.selectedNetwork.chain)
    ) {
      getContractAddressInfo()
    }
  }, [state.selectedNetwork])

  React.useEffect(() => {
    if (
      typeof activeNetwork !== 'undefined' &&
      toLower(state.selectedNetwork.chain) !== toLower(activeNetwork)
    ) {
      const getNetworkInfo = getEthNetwork(activeNetwork)

      if (getNetworkInfo) {
        updateState({ selectedNetwork: getNetworkInfo })

        const findCurrency = getCurrency(getNetworkInfo.symbol)

        if (findCurrency) {
          updateState({ logoBackground: findCurrency.background })
        }
      }
    }
  }, [activeNetwork])

  const getContractAddressInfo = async (): Promise<void> => {
    updateState({ isLoading: true })

    if (state.errorLabel) {
      updateState({ errorLabel: null })
    }

    if (
      state.tokenInfo.name.length ||
      state.tokenInfo.symbol.length ||
      state.tokenInfo.decimals > 0
    ) {
      updateState({
        tokenInfo: initialToken,
      })
    }

    const data = await getContractInfo(state.contractAddress, state.selectedNetwork.chain)

    updateState({ isLoading: false })

    if (data) {
      const { name, symbol, decimals } = data

      const checkExistToken = getToken(symbol, state.selectedNetwork.chain)

      updateState({
        tokenInfo: {
          name,
          symbol,
          decimals,
        },
        logoSymbol: checkExistToken?.symbol || state.selectedNetwork.symbol,
      })
    } else {
      useToast('Token Contract Address is not found')
    }
  }

  const onConfirm = (): void => {
    if (currency) {
      return updateState({ activeDrawer: 'confirm' })
    }
    const walletsList = getWallets()

    if (walletsList) {
      const { chain, name: chainName } = state.selectedNetwork
      const { symbol, name: tokenName, decimals } = state.tokenInfo

      const checkTokenWallets = checkExistWallet(walletsList, symbol, chain)

      const routeProps = {
        symbol,
        chain,
        chainName,
        tokenName,
        contractAddress: state.contractAddress,
        decimals,
        tokenStandart: getTokenStandart(toLower(chain)),
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
      updateState({ selectedNetwork: getNetworkInfo })

      const findCurrency = getCurrency(getNetworkInfo.symbol)

      if (findCurrency) {
        updateState({ logoBackground: findCurrency.background })
      }
    }
  }

  const onBlurInput = (): void => {
    if (!validateContractAddress(state.contractAddress, state.selectedNetwork.chain)) {
      updateState({ errorLabel: 'Token Contract Address is not valid' })
    } else {
      if (state.errorLabel) {
        updateState({ errorLabel: null })
      }
    }
  }

  const onChangeAddress = (contractAddress: string): void => {
    if (!state.isLoading) {
      updateState({ contractAddress })
    }
  }

  const onConfirmDrawer = (): void => {
    if (validatePassword(state.password) && currency) {
      const backup = getItem('backup')

      if (backup) {
        const decryptBackup = decrypt(backup, state.password)
        if (decryptBackup && locationState?.address) {
          const parseBackup = JSON.parse(decryptBackup)

          const findWallet = parseBackup?.wallets?.find(
            (wallet: IWallet) => wallet.address === locationState.address
          )

          const walletsList = addNewWallet(
            locationState.address,
            findWallet.privateKey,
            decryptBackup,
            state.password,
            [state.tokenInfo.symbol],
            false,
            currency.chain,
            state.tokenInfo.name,
            state.contractAddress,
            state.tokenInfo.decimals
          )

          if (walletsList) {
            setItem('backupStatus', 'notDownloaded')

            return history.replace('/download-backup', {
              password: state.password,
              from: 'addCustomToken',
            })
          }
        }
      }
    }
    updateState({ drawerErrorLabel: 'Password is not valid' })
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const setPassword = (password: string): void => {
    updateState({ password })
  }

  const dropDownList = networks.filter(
    (network: IEthNetwork) => network.symbol !== state.selectedNetwork.symbol
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
    !state.tokenInfo.name.length ||
    !state.tokenInfo.symbol.length ||
    state.tokenInfo.decimals <= 0 ||
    !state.contractAddress.length ||
    state.isLoading ||
    state.errorLabel !== null

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
                size={40}
                symbol={state.logoSymbol}
                chain={state.selectedNetwork.chain}
                name={state.tokenInfo.name || 'T'}
                background={state.logoBackground}
              />
              <Styles.TokenCardRow>
                <Skeleton width={90} height={19} mt={6} isLoading={state.isLoading} type="gray">
                  <Styles.TokenName>{state.tokenInfo.name || 'Token name'}</Styles.TokenName>
                </Skeleton>
                <Skeleton width={40} height={15} mt={4} isLoading={state.isLoading} type="gray">
                  <Styles.TokenSymbol>{state.tokenInfo.symbol || 'Ticker'}</Styles.TokenSymbol>
                </Skeleton>
                <Styles.DecimalRow>
                  <Styles.TokenDecimalLabel>Decimals:</Styles.TokenDecimalLabel>
                  <Skeleton width={20} height={14} mt={0} isLoading={state.isLoading} type="gray">
                    {state.tokenInfo.decimals > 0 ? (
                      <Styles.TokenDecimal>{state.tokenInfo.decimals}</Styles.TokenDecimal>
                    ) : null}
                  </Skeleton>
                </Styles.DecimalRow>
              </Styles.TokenCardRow>
            </Styles.TokenCard>
          </Styles.Row>

          <Styles.Form>
            <CurrenciesDropdown
              label={activeNetwork ? 'Network' : 'Select network'}
              value={state.selectedNetwork.name}
              currencySymbol={state.selectedNetwork.symbol}
              list={mapList}
              onSelect={onSelectDropdown}
              currencyBr={20}
              disabled={typeof activeNetwork !== 'undefined'}
            />
            <TextInput
              label="Token Contract Address"
              value={state.contractAddress}
              onChange={onChangeAddress}
              onBlurInput={onBlurInput}
              errorLabel={state.errorLabel}
              type="text"
            />
            <Styles.ButtonRow>
              <Button
                label="Confirm"
                disabled={isButtonDisabled}
                onClick={onConfirm}
                isLoading={state.isLoading}
              />
            </Styles.ButtonRow>
          </Styles.Form>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={state.activeDrawer === 'confirm'}
        onClose={onCloseDrawer}
        title="Confirm adding new address"
        inputLabel="Enter password"
        textInputValue={state.password}
        isButtonDisabled={!validatePassword(state.password)}
        onConfirm={onConfirmDrawer}
        onChangeText={setPassword}
        textInputType="password"
        inputErrorLabel={state.drawerErrorLabel}
      />
    </>
  )
}

export default AddCustomToken
