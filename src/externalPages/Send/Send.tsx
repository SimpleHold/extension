import * as React from 'react'
import { render } from 'react-dom'
import numeral from 'numeral'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Components
import CurrenciesDropdown from '@components/CurrenciesDropdown'
import TextInput from '@components/TextInput'
import Button from '@components/Button'
import Skeleton from '@components/Skeleton'
import Spinner from '@components/Spinner'

// Utils
import { getWallets, IWallet } from '@utils/wallet'
import { getBalance } from '@utils/api'
import { getCurrentTab, updateTab, getUrl } from '@utils/extension'
import { price, toLower, toUpper } from '@utils/format'
import { validateAddress, getNewNetworkFee, isEthereumLike } from '@utils/address'

// Config
import { getCurrency, getCurrencyByChain, ICurrency } from '@config/currencies'
import { getToken } from '@config/tokens'

// Hooks
import useDebounce from '@hooks/useDebounce'

// Styles
import Styles from './styles'

type TabInfo = {
  favIconUrl: string
  url: string
}

interface Props {
  readOnly?: boolean
  currency?: string
  amount?: number
  recipientAddress?: string
}

const Send: React.FC = () => {
  const [address, setAddress] = React.useState<string>('')
  const [amount, setAmount] = React.useState<string>('')
  const [walletsList, setWalletsList] = React.useState<IWallet[]>([])
  const [selectedWallet, setSelectedWallet] = React.useState<null | IWallet>(null)
  const [currencyInfo, setCurrencyInfo] = React.useState<ICurrency | null>(null)
  const [balance, setBalance] = React.useState<number | null>(null)
  const [estimated, setEstimated] = React.useState<number | null>(null)
  const [addressErrorLabel, setAddressErrorLabel] = React.useState<null | string>(null)
  const [tabInfo, setTabInfo] = React.useState<TabInfo | null>(null)
  const [props, setProps] = React.useState<Props>({})
  const [networkFee, setNetworkFee] = React.useState<number>(0)
  const [isNetworkFeeLoading, setNetworkFeeLoading] = React.useState<boolean>(false)
  const [amountErrorLabel, setAmountErrorLabel] = React.useState<null | string>(null)
  const [outputs, setOutputs] = React.useState<UnspentOutput[]>([])

  const debounced = useDebounce(amount, 1000)

  React.useEffect(() => {
    getWalletsList(localStorage.getItem('sendPageProps'))
    getStorageData()
  }, [])

  React.useEffect(() => {
    if (selectedWallet) {
      getCurrencyInfo()
      getCurrencyBalance()
      checkValidAddress()
    }
  }, [selectedWallet])

  React.useEffect(() => {
    checkProps()
  }, [props])

  React.useEffect(() => {
    if (amount.length && Number(balance) > 0 && !amountErrorLabel && selectedWallet) {
      getNetworkFee()
    }
  }, [debounced])

  const getNetworkFee = async (): Promise<void> => {
    if (selectedWallet) {
      setNetworkFeeLoading(true)

      const { symbol } = selectedWallet

      const currencyInfo = getCurrency(symbol)

      if (currencyInfo) {
        const data = await getNewNetworkFee({
          symbol,
          amount,
          chain: currencyInfo.chain,
          from: selectedWallet.address,
          to: address,
        })

        setNetworkFeeLoading(false)

        if (data) {
          if (data.networkFee) {
            setNetworkFee(data.networkFee)
          }
        }
      }
    }
  }

  const checkProps = () => {
    if (Object.keys(props).length) {
      const { amount: propsAmount, recipientAddress } = props

      if (propsAmount) {
        setAmount(`${propsAmount}`)
      }

      if (recipientAddress) {
        setAddress(recipientAddress)
      }
    }
  }

  const getStorageData = (): void => {
    const tabInfo = localStorage.getItem('tab')
    const getProps = localStorage.getItem('sendPageProps')

    if (tabInfo) {
      const { favIconUrl = undefined, url = undefined } = JSON.parse(tabInfo)

      if (favIconUrl && url) {
        setTabInfo({
          favIconUrl,
          url: new URL(url).host,
        })
      }
      localStorage.removeItem('tab')
    }

    if (getProps) {
      const parseProps = JSON.parse(getProps)

      setProps(parseProps)
      localStorage.removeItem('sendPageProps')
    }
  }

  const getCurrencyInfo = (): void => {
    if (selectedWallet) {
      const info = getCurrency(selectedWallet?.symbol)

      if (info) {
        setCurrencyInfo(info)
      }
    }
  }

  const getCurrencyBalance = async (): Promise<void> => {
    setBalance(null)
    setEstimated(null)

    if (selectedWallet) {
      const { address, symbol } = selectedWallet

      const getCurrencyInfo = getCurrency(symbol)

      if (getCurrencyInfo) {
        const { balance, balance_usd } = await getBalance(address, getCurrencyInfo?.chain)

        setBalance(balance)
        setEstimated(balance_usd)
      }
    }
  }

  const getWalletsList = (sendPageProps: string | null): void => {
    const wallets = getWallets()

    let currency: undefined | string = undefined

    if (sendPageProps) {
      const parsePageProps = JSON.parse(sendPageProps)

      if (parsePageProps?.currency) {
        currency = parsePageProps.currency
      }
    }

    if (wallets?.length) {
      if (currency) {
        const filterWallets = wallets.filter(
          (wallet: IWallet) => toLower(wallet.symbol) === toLower(currency)
        )

        if (filterWallets.length) {
          setWalletsList(filterWallets)
          setSelectedWallet(filterWallets[0])
        } else {
          setWalletsList(wallets)
          setSelectedWallet(null)
        }
      } else {
        setWalletsList(wallets)
        setSelectedWallet(wallets[0])
      }
    }
  }

  const onClose = (): void => {
    window.close()
  }

  const onConfirm = async (): Promise<void> => {
    const currenctTab = await getCurrentTab()

    const url = getUrl('send-confirmation.html')

    if (currenctTab?.id && selectedWallet) {
      const currency = selectedWallet?.chain
        ? getToken(selectedWallet.symbol, selectedWallet.chain)
        : getCurrency(selectedWallet.symbol)

      const data = {
        amount: Number(amount),
        symbol: selectedWallet.symbol,
        addressFrom: selectedWallet.address,
        addressTo: address,
        networkFee,
        tabInfo,
        chain: currency?.chain,
      }

      localStorage.setItem('sendConfirmationData', JSON.stringify(data))
      await updateTab(currenctTab.id, {
        url,
      })
    }
  }

  const dropdownList = walletsList
    ?.filter(
      (wallet: IWallet) =>
        toLower(wallet.address) !== toLower(selectedWallet?.address) ||
        toLower(wallet?.chain) !== toLower(selectedWallet?.chain)
    )
    .map((wallet: IWallet) => {
      const currencyInfo = wallet?.chain
        ? getCurrencyByChain(wallet.chain)
        : getCurrency(wallet?.symbol)

      return {
        logo: {
          symbol: wallet.symbol,
          width: 40,
          height: 40,
          br: 13,
          background: currencyInfo?.background,
          chain: wallet?.chain,
        },
        label: wallet?.name || currencyInfo?.name,
        value: wallet.address,
        chain: wallet?.chain,
      }
    })

  const onSelectDropdown = (index: number) => {
    const currency = dropdownList[index]

    const findWallet = walletsList.find(
      (wallet: IWallet) =>
        toLower(wallet.address) === toLower(currency.value) &&
        toLower(wallet?.chain) === toLower(currency?.chain)
    )

    if (findWallet) {
      setSelectedWallet(findWallet)
    }
  }

  const checkValidAddress = (): void => {
    if (addressErrorLabel) {
      setAddressErrorLabel(null)
    }

    if (selectedWallet) {
      if (
        address.length &&
        // @ts-ignore
        !validateAddress(selectedWallet.symbol, address, selectedWallet?.chain)
      ) {
        return setAddressErrorLabel('Address is not valid')
      }

      if (address === selectedWallet.address) {
        return setAddressErrorLabel('Address same as sender')
      }
    }

    if (!networkFee && Number(amount) > 0) {
      getNetworkFee()
    }
  }

  const onBlurAmountInput = (): void => {
    if (amountErrorLabel) {
      setAmountErrorLabel(null)
    }

    if (amount.length && Number(amount) + Number(networkFee) >= Number(balance)) {
      return setAmountErrorLabel('Insufficient funds')
    }
  }

  const isButtonDisabled = (): boolean => {
    if (selectedWallet) {
      if (
        validateAddress(selectedWallet.symbol, address) &&
        amount.length &&
        Number(amount) > 0 &&
        addressErrorLabel === null &&
        amountErrorLabel === null &&
        Number(balance) > 0 &&
        networkFee > 0 &&
        !isNetworkFeeLoading
      ) {
        if (!outputs.length) {
          if (
            selectedWallet?.contractAddress ||
            isEthereumLike(selectedWallet.symbol, selectedWallet?.chain)
          ) {
            return false
          }
          return true
        }
      }
    }
    return true
  }

  return (
    <ExternalPageContainer onClose={onClose} headerStyle="green">
      <Styles.Body>
        <Styles.Heading>
          <Styles.TitleRow>
            <Styles.Title>Send it on</Styles.Title>
            {tabInfo ? (
              <Styles.SiteInfo>
                <Styles.SiteFavicon src={tabInfo.favIconUrl} />
                <Styles.SiteUrl>{tabInfo.url}</Styles.SiteUrl>
              </Styles.SiteInfo>
            ) : null}
          </Styles.TitleRow>
          <Skeleton
            width={250}
            height={42}
            type="gray"
            mt={31}
            isLoading={balance === null || !selectedWallet}
          >
            <Styles.Balance>
              {numeral(balance).format('0.[000000]')} {toUpper(selectedWallet?.symbol)}
            </Styles.Balance>
          </Skeleton>
          <Skeleton
            width={130}
            height={23}
            mt={10}
            type="gray"
            isLoading={estimated === null || !selectedWallet}
          >
            <Styles.Estimated>{`$${price(estimated, 2)} USD`}</Styles.Estimated>
          </Skeleton>
        </Styles.Heading>
        <Styles.Form>
          {walletsList.length ? (
            <CurrenciesDropdown
              list={dropdownList}
              onSelect={onSelectDropdown}
              currencyBr={13}
              label="Select address"
              value={selectedWallet?.address}
              currencySymbol={selectedWallet?.symbol}
              background={currencyInfo?.background}
              disabled={walletsList.length < 2}
            />
          ) : null}
          <TextInput
            label="Recipient Address"
            value={address}
            onChange={setAddress}
            openFrom="browser"
            errorLabel={addressErrorLabel}
            onBlurInput={checkValidAddress}
            disabled={balance === null || props?.readOnly}
          />
          <TextInput
            label="Amount (BTC)"
            value={amount}
            onChange={setAmount}
            type="number"
            openFrom="browser"
            errorLabel={amountErrorLabel}
            onBlurInput={onBlurAmountInput}
            disabled={props?.readOnly}
          />
          <Styles.NetworkFeeBlock>
            <Styles.NetworkFeeLabel>Network fee:</Styles.NetworkFeeLabel>
            {isNetworkFeeLoading ? (
              <Spinner ml={10} size={16} />
            ) : (
              <>
                {networkFee === 0 ? (
                  <Styles.NetworkFee>-</Styles.NetworkFee>
                ) : (
                  <Styles.NetworkFee>
                    {networkFee} {toUpper(selectedWallet?.symbol)}
                  </Styles.NetworkFee>
                )}
              </>
            )}
          </Styles.NetworkFeeBlock>

          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onClose} isSmall mr={7.5} />
            <Button
              label="Send"
              disabled={isButtonDisabled()}
              onClick={onConfirm}
              isSmall
              ml={7.5}
            />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Body>
    </ExternalPageContainer>
  )
}

render(<Send />, document.getElementById('send'))
