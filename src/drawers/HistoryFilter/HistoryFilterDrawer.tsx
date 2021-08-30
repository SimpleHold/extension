import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

import Dropdown from './components/Dropdown'
import Currency from './components/Currency'
import Wallet from './components/Wallet'

// Utils
import { getWallets, IWallet } from '@utils/wallet'
import { toLower } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  isActive: boolean
}

type TStatuses = 'sended' | 'received' | 'pending'

type TStatusItem = {
  title: string
  key: TStatuses
}

const statuses: TStatusItem[] = [
  {
    title: 'Sended',
    key: 'sended',
  },
  {
    title: 'Received',
    key: 'received',
  },
  {
    title: 'Pending',
    key: 'pending',
  },
]

type TCurrency = {
  symbol: string
  chain?: string
}

const HistoryFilterDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive } = props

  const [status, setStatus] = React.useState<TStatuses | null>('received')
  const [wallets, setWallets] = React.useState<IWallet[]>([])
  const [selectedCurrencies, setCurrencies] = React.useState<TCurrency[]>([])

  React.useEffect(() => {
    onGetWallets()
  }, [])

  const onGetWallets = (): void => {
    const walletsList = getWallets()

    if (walletsList?.length) {
      const filterWallets = walletsList.filter(
        (v, i, a) =>
          a.findIndex(
            (wallet: IWallet) => wallet.symbol === v.symbol && wallet.chain === v.chain
          ) === i
      )

      setWallets(filterWallets)
    }
  }

  const onApply = (): void => {}

  const selectStatus = (status: TStatuses) => (): void => {
    setStatus(status)
  }

  const onToggleCurrency = (symbol: string, isActive: boolean, chain?: string) => (): void => {
    let newCurrenciesList = [...selectedCurrencies]

    if (isActive) {
      newCurrenciesList = newCurrenciesList.filter(
        (currency: TCurrency) =>
          toLower(currency.symbol) !== toLower(symbol) || toLower(currency.chain) !== toLower(chain)
      )
    } else {
      newCurrenciesList.push({
        symbol,
        chain,
      })
    }

    setCurrencies(newCurrenciesList)
  }

  const renderCurrencies = (
    <>
      {wallets.map((wallet: IWallet) => {
        const { symbol, chain } = wallet
        const name = 'Bitcoin' // Fix me
        const isActive =
          selectedCurrencies.find(
            (currency: TCurrency) =>
              toLower(currency.symbol) === toLower(symbol) &&
              toLower(currency.chain) === toLower(chain)
          ) !== undefined

        return (
          <Currency
            symbol={symbol}
            chain={chain}
            name={name}
            isActive={isActive}
            onToggle={onToggleCurrency(symbol, isActive, chain)}
          />
        )
      })}
    </>
  )

  const renderAddresses = (
    <>
      <Wallet
        symbol="btc"
        walletName="Wallet name"
        address="bc1q34aq5drsd23ruwyw77gl9"
        isActive={false}
        onToggle={() => null}
      />
    </>
  )

  return (
    <DrawerWrapper
      title="Filter history"
      isActive={isActive}
      onClose={onClose}
      withCloseIcon
      height={540}
    >
      <>
        <Styles.Row>
          <Styles.Group>
            <Styles.GroupHeading>
              <Styles.GroupTitle>Status</Styles.GroupTitle>
            </Styles.GroupHeading>
            <Styles.Statuses>
              {statuses.map((statusItem: TStatusItem) => {
                const { title, key } = statusItem
                const isActive = status === key

                return (
                  <Styles.Status key={key} isActive={isActive} onClick={selectStatus(key)}>
                    <Styles.StatusTitle>{title}</Styles.StatusTitle>
                  </Styles.Status>
                )
              })}
            </Styles.Statuses>
          </Styles.Group>

          <Styles.Group>
            <Styles.GroupHeading>
              <Styles.GroupTitle>Currency</Styles.GroupTitle>
              {selectedCurrencies.length ? (
                <Styles.ResetGroup>
                  <Styles.ResetTitle>{selectedCurrencies.length} selected</Styles.ResetTitle>
                  <Styles.ResetIcon>
                    <SVG src="../../assets/icons/times.svg" width={8.33} height={8.33} />
                  </Styles.ResetIcon>
                </Styles.ResetGroup>
              ) : null}
            </Styles.GroupHeading>
            <Dropdown title="Select currencies" render={renderCurrencies} />
          </Styles.Group>

          <Styles.Group>
            <Styles.GroupHeading>
              <Styles.GroupTitle>Address</Styles.GroupTitle>
            </Styles.GroupHeading>
            <Dropdown title="Select addresses" render={renderAddresses} />
          </Styles.Group>
        </Styles.Row>
        <Button label="Apply" isLight onClick={onApply} />
      </>
    </DrawerWrapper>
  )
}

export default HistoryFilterDrawer
