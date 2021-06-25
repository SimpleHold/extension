import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import numeral from 'numeral'

// Components
import Skeleton from '@components/Skeleton'

// Container
import SendPageContainer from '@containers/SendPage'

// Utils
import { toUpper, price } from '@utils/format'
import { getBalance } from '@utils/api'
import { getWallets, IWallet, updateBalance } from '@utils/wallet'
import { logEvent } from '@utils/amplitude'
import { getExtraIdName, validateAddress } from '@utils/currencies'

// Config
import { getToken } from '@config/tokens'
import { getCurrency } from '@config/currencies'
import { ADDRESS_SEND, ADDRESS_SEND_CANCEL } from '@config/events'

// Types
import { TConfirmParams } from '@containers/SendPage/SendPageContainer'

// Styles
import Styles from './styles'

type TStyles = {
  wrapper: React.CSSProperties
  container: React.CSSProperties
  form: React.CSSProperties
}

interface LocationState {
  symbol: TSymbols
  address: string
  chain: string
  tokenChain?: string
  contractAddress?: string
  tokenName?: string
  decimals?: number
}

const getStyles = (withExtraid: boolean): TStyles => {
  return {
    wrapper: {
      height: '600px',
    },
    container: {
      backgroundColor: '#ffffff',
      borderRadius: '5px 5px 0 0',
      height: '540px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    form: {
      padding: withExtraid ? '20px 30px' : '20px 30px 30px 30px',
      backgroundColor: '#f8f8f8',
      borderTop: '1px solid #eaeaea',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
  }
}

const Send: React.FC = () => {
  const history = useHistory()
  const {
    state: {
      symbol,
      address: locationAddress,
      chain,
      tokenChain = undefined,
      contractAddress = undefined,
      tokenName = undefined,
      decimals = undefined,
    },
  } = useLocation<LocationState>()

  const currency = tokenChain ? getToken(symbol, tokenChain) : getCurrency(symbol)

  const [balance, setBalance] = React.useState<null | number>(null)
  const [estimated, setEstimated] = React.useState<null | number>(null)
  const [extraIdName, setExtraIdName] = React.useState<string>('')
  const [selectedAddress, setSelectedAddress] = React.useState<string>(locationAddress)
  const [addresses, setAddresses] = React.useState<string[]>([])
  const [addressErrorLabel, setAddressErrorLabel] = React.useState<null | string>(null)

  React.useEffect(() => {
    getWalletsList()
    onGetNetworkFeeSymbol()
    getExtraId()
  }, [])

  React.useEffect(() => {
    loadBalance()
  }, [selectedAddress])

  const loadBalance = async (): Promise<void> => {
    setBalance(null)
    setEstimated(null)

    if (currency || contractAddress) {
      const { balance, balance_usd, balance_btc } = await getBalance(
        selectedAddress,
        currency?.chain || tokenChain,
        tokenChain ? symbol : undefined,
        contractAddress
      )

      setBalance(balance)
      updateBalance(selectedAddress, symbol, balance, balance_btc)
      setEstimated(balance_usd)
    }
  }

  const getWalletsList = (): void => {
    const walletsList = getWallets()

    if (walletsList) {
      const filterWallets = walletsList
        .filter((wallet: IWallet) => wallet.symbol === symbol)
        .map((wallet: IWallet) => wallet.address)
      setAddresses(filterWallets)
    }
  }

  const onGetNetworkFeeSymbol = (): void => {}

  const getExtraId = (): void => {
    const name = getExtraIdName(symbol)

    if (name) {
      setExtraIdName(name)
    }
  }

  const onCancel = (): void => {
    logEvent({
      name: ADDRESS_SEND_CANCEL,
    })

    history.goBack()
  }

  const onConfirm = (params: TConfirmParams): void => {
    logEvent({
      name: ADDRESS_SEND,
    })

    const tokenContractAddress = tokenChain ? getToken(symbol, tokenChain)?.address : undefined
    const getTokenDecimals = tokenChain ? getToken(symbol, tokenChain)?.decimals : undefined

    history.push('/send-confirm', {
      ...params,
      symbol,
      addressFrom: selectedAddress,
      chain,
      contractAddress: tokenContractAddress || contractAddress,
      tokenChain,
      decimals: getTokenDecimals || decimals,
    })
  }

  const withExtraid = extraIdName?.length > 0
  const styles = getStyles(withExtraid)

  const renderRow = (
    <Styles.Row withExtraid={withExtraid}>
      {!extraIdName?.length ? <Styles.PageTitle>Send</Styles.PageTitle> : null}
      <Skeleton width={250} height={42} type="gray" mt={21} isLoading={balance === null}>
        <Styles.Balance>
          {numeral(balance).format('0.[000000]')} {toUpper(symbol)}
        </Styles.Balance>
      </Skeleton>
      <Skeleton width={130} height={23} mt={5} type="gray" isLoading={estimated === null}>
        <Styles.USDEstimated>{`$${price(estimated, 2)}`}</Styles.USDEstimated>
      </Skeleton>
    </Styles.Row>
  )

  const mapDropDownList = addresses
    .filter((address: string) => address !== selectedAddress)
    .map((address: string) => {
      return {
        logo: {
          symbol: symbol,
          width: 40,
          height: 40,
          br: 10,
          background: currency?.background,
          chain: tokenChain,
        },
        label: currency?.name,
        value: address,
      }
    })

  const onSelectDropDown = (index: number) => {
    setSelectedAddress(mapDropDownList[index].value)
  }

  const onBlurAddressInput = (address: string): void => {
    if (addressErrorLabel) {
      setAddressErrorLabel(null)
    }

    if (address.length && !validateAddress(symbol, chain, address, tokenChain)) {
      setAddressErrorLabel('Address is not valid')
    }

    if (address === selectedAddress) {
      setAddressErrorLabel('Address same as sender')
    }
  }

  const dropDownProps = {
    label: currency?.name,
    value: selectedAddress,
    currencySymbol: symbol,
    background: currency?.background,
    list: mapDropDownList,
    onSelect: onSelectDropDown,
    disabled: addresses.length < 2,
    tokenChain,
    tokenName,
  }

  return (
    <SendPageContainer
      styles={styles}
      renderRow={renderRow}
      withCover
      withHeader
      goBack={history.goBack}
      currency={currency}
      balance={balance}
      withExtraid={withExtraid}
      extraIdName={extraIdName}
      selectedAddress={selectedAddress}
      onCancel={onCancel}
      onConfirm={onConfirm}
      chain={chain}
      dropDown={dropDownProps}
      onBlurAddressInput={onBlurAddressInput}
      addressErrorLabel={addressErrorLabel}
    />
  )
}

export default Send
