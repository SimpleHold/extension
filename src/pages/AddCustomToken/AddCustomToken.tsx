import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import CurrencyLogo from '@components/CurrencyLogo'
import TextInput from '@components/TextInput'
import Button from '@components/Button'
import Skeleton from '@components/Skeleton'
import CurrenciesDropdown from 'components/CurrenciesDropdown'

// Config
import { validateContractAddress } from '@config/tokens'

// Utils
import { getContractInfo } from '@utils/api'

// Hooks
import useDebounce from '@hooks/useDebounce'

// Styles
import Styles from './styles'

const AddCustomToken: React.FC = () => {
  const history = useHistory()

  const [platform, setPlatform] = React.useState<'eth' | 'bsc'>('eth')
  const [tokenName, setTokenName] = React.useState<string>('')
  const [tokenTicker, setTokenTicker] = React.useState<string>('')
  const [tokenDecimals, setTokenDecimals] = React.useState<number>(0)
  const [contractAddress, setContractAddress] = React.useState<string>('')
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)

  const debounced = useDebounce(contractAddress, 1000)

  React.useEffect(() => {
    if (
      contractAddress.length &&
      !errorLabel &&
      validateContractAddress(contractAddress, platform)
    ) {
      setIsLoading(true)

      getContractAddressInfo()
    }
  }, [debounced])

  const onBlurInput = (): void => {
    if (validateContractAddress(contractAddress, platform)) {
      if (errorLabel) {
        setErrorLabel(null)
      }
    } else {
      if (!errorLabel) {
        setErrorLabel('Token Contract Address is not valid')
      }
    }
  }

  const getContractAddressInfo = async (): Promise<any> => {
    const data = await getContractInfo(contractAddress, platform)

    setIsLoading(false)

    if (data) {
      const { name, symbol, decimals } = data

      setTokenName(name)
      setTokenTicker(symbol)
      setTokenDecimals(decimals)
    }
  }

  const onConfirm = (): void => {}

  const isButtonDisabled =
    !tokenName.length ||
    !tokenTicker.length ||
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
            <CurrencyLogo symbol={platform} width={40} height={40} platform={platform} hideLogo />
            <Styles.TokenCardRow>
              <Skeleton width={90} height={19} mt={6} isLoading={isLoading} type="gray">
                <Styles.TokenName>{tokenName || 'Token name'}</Styles.TokenName>
              </Skeleton>
              <Skeleton width={40} height={15} mt={4} isLoading={isLoading} type="gray">
                <Styles.TokenTicker>TICKER - {tokenTicker}</Styles.TokenTicker>
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
            currencySymbol={platform}
            list={[
              {
                logo: {
                  symbol: 'bnb',
                  width: 40,
                  height: 40,
                  br: 20,
                  background: '#1D1D22',
                },
                value: 'Binance',
              },
            ]}
            onSelect={setPlatform}
            value="Ethereum"
            label="Select network"
          />
          <TextInput
            value={contractAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setContractAddress(e.target.value)
            }
            label="Token Contract Address"
            onBlurInput={onBlurInput}
            errorLabel={errorLabel}
          />
          <Styles.ButtonRow>
            <Button label="Confirm" onClick={onConfirm} disabled={isButtonDisabled} />
          </Styles.ButtonRow>
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default AddCustomToken
