import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import CurrencyLogo from '@components/CurrencyLogo'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Config
import platforms, { getPlatform } from '@config/platforms'
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

    if (data) {
      const { name, symbol, decimals } = data

      setTokenName(name)
      setTokenTicker(symbol)
      setTokenDecimals(decimals)
    }
  }

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={history.goBack} backTitle="Select currency" />
      <Styles.Container>
        <Styles.Row>
          <Styles.Title>Add custom token</Styles.Title>

          <Styles.TokenCard>
            <CurrencyLogo symbol={platform} width={40} height={40} platform={platform} />
            <Styles.TokenCardRow>
              <Styles.TokenName>{tokenName || 'Token name'}</Styles.TokenName>
              <Styles.TokenTicker>TICKER - {tokenTicker}</Styles.TokenTicker>
              <Styles.TokenDecimal>
                Decimals of precion: - {tokenDecimals || null}
              </Styles.TokenDecimal>
            </Styles.TokenCardRow>
          </Styles.TokenCard>
        </Styles.Row>
        <Styles.Form>
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
            <Button label="Confirm" onClick={() => null} />
          </Styles.ButtonRow>
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default AddCustomToken
