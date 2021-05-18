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
import { getCurrentTab, updateTab, getUrl, openWebPage } from '@utils/extension'

// Config
import { getCurrency } from '@config/currencies'

// Styles
import Styles from './styles'
import { price, toUpper } from 'utils/format'

const Send: React.FC = () => {
  const [address, setAddress] = React.useState<string>('')
  const [amount, setAmount] = React.useState<string>('')
  const [walletsList, setWalletsList] = React.useState<IWallet[]>([])
  const [selectedWallet, setSelectedWallet] = React.useState<null | IWallet>(null)
  const [selectedCurrencyName, setSelectedCurrencyName] = React.useState<string>('')
  const [balance, setBalance] = React.useState<number | null>(null)
  const [estimated, setEstimated] = React.useState<number | null>(null)

  React.useEffect(() => {
    getWalletsList()
  }, [])

  React.useEffect(() => {
    if (selectedWallet) {
      getCurrencyInfo()
      getCurrencyBalance()
    }
  }, [selectedWallet])

  const getCurrencyInfo = (): void => {
    if (selectedWallet) {
      const info = getCurrency(selectedWallet?.symbol)

      if (info) {
        setSelectedCurrencyName(info.name)
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
      setWalletsList(wallets)
      setSelectedWallet(wallets[0])
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

  return (
    <ExternalPageContainer onClose={onClose}>
      <Styles.Body>
        <Styles.Heading>
          <Styles.TitleRow>
            <Styles.Title>Send it on</Styles.Title>
            <Styles.SiteInfo>
              <Styles.SiteFavicon src="https://simpleswap.io/static/favicon/favicon.ico?v=zXvRzEYzbj" />
              <Styles.SiteUrl>simpleswap.io</Styles.SiteUrl>
            </Styles.SiteInfo>
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
              list={[]}
              onSelect={() => null}
              currencyBr={13}
              label={selectedCurrencyName}
              value={selectedWallet.address}
              currencySymbol={selectedWallet.symbol}
            />
          ) : null}
          <TextInput
            label="Recipient Address"
            value={address}
            onChange={setAddress}
            openFrom="browser"
          />
          <TextInput
            label="Amount (BTC)"
            value={amount}
            onChange={setAmount}
            type="number"
            openFrom="browser"
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
