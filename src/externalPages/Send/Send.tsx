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

// Utils
import { getWallets, IWallet } from '@utils/wallet'
import { getBalance } from '@utils/api'
import { getCurrentTab, updateTab, getUrl } from '@utils/extension'
import { price, toLower, toUpper } from '@utils/format'
import { validateAddress } from '@utils/address'

// Config
import { getCurrency, getCurrencyByChain, ICurrency } from '@config/currencies'

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

  React.useEffect(() => {
    getStorageData()
  }, [])

  React.useEffect(() => {
    if (selectedWallet) {
      getCurrencyInfo()
      getCurrencyBalance()
    }
  }, [selectedWallet])

  React.useEffect(() => {
    checkProps()
    getWalletsList()
  }, [props])

  const checkProps = () => {
    if (Object.keys(props).length) {
      const { amount: propsAmount, recipientAddress, currency } = props

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
    if (selectedWallet) {
      setBalance(null)
      setEstimated(null)

      const { balance, balance_usd } = await getBalance(
        selectedWallet.address,
        selectedWallet.symbol
      )

      setBalance(balance)
      setEstimated(balance_usd)
    }
  }

  const getWalletsList = (): void => {
    const wallets = getWallets()

    if (wallets) {
      if (props?.currency) {
        const filterWallets = wallets.filter(
          (wallet: IWallet) => toLower(wallet.symbol) === toLower(props.currency)
        )

        setWalletsList(filterWallets)

        if (filterWallets.length) {
          setSelectedWallet(filterWallets[0])
        } else {
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

    if (currenctTab?.id) {
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

  const onBlurAddressInput = (): void => {
    if (addressErrorLabel) {
      setAddressErrorLabel(null)
    }

    if (selectedWallet) {
      if (
        address.length &&
        // @ts-ignore
        !validateAddress(selectedWallet.symbol, address, selectedWallet?.chain)
      ) {
        setAddressErrorLabel('Address is not valid')
      }

      if (address === selectedWallet.address) {
        setAddressErrorLabel('Address same as sender')
      }
    }
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
          <Skeleton width={250} height={42} type="gray" mt={31} isLoading={balance === null}>
            <Styles.Balance>
              {numeral(balance).format('0.[000000]')} {toUpper(selectedWallet?.symbol)}
            </Styles.Balance>
          </Skeleton>
          <Skeleton width={130} height={23} mt={10} type="gray" isLoading={estimated === null}>
            <Styles.Estimated>{`$${price(estimated, 2)} USD`}</Styles.Estimated>
          </Skeleton>
        </Styles.Heading>
        <Styles.Form>
          {walletsList.length && selectedWallet ? (
            <CurrenciesDropdown
              list={dropdownList}
              onSelect={onSelectDropdown}
              currencyBr={13}
              label={currencyInfo?.name}
              value={selectedWallet.address}
              currencySymbol={selectedWallet.symbol}
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
            onBlurInput={onBlurAddressInput}
            disabled={balance === null || props?.readOnly}
          />
          <TextInput
            label="Amount (BTC)"
            value={amount}
            onChange={setAmount}
            type="number"
            openFrom="browser"
            disabled={props?.readOnly}
          />
          <Styles.NetworkFee>
            <Styles.NetworkFeeLabel>Network fee:</Styles.NetworkFeeLabel>
          </Styles.NetworkFee>

          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onClose} isSmall mr={7.5} />
            <Button label="Send" onClick={onConfirm} isSmall ml={7.5} />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Body>
    </ExternalPageContainer>
  )
}

render(<Send />, document.getElementById('send'))
