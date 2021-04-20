import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'
import { browser, Tabs } from 'webextension-polyfill-ts'
import numeral from 'numeral'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'
import CurrencyLogo from '@components/CurrencyLogo'
import DropDown from '@components/DropDown'
import Skeleton from '@components/Skeleton'
import QRCode from '@components/QRCode'
import CopyToClipboard from '@components/CopyToClipboard'
import PendingBalance from '@components/PendingBalance'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import ShowPrivateKeyDrawer from '@drawers/ShowPrivateKey'

// Hooks
import useVisible from '@hooks/useVisible'

// Utils
import { getBalance } from '@utils/api'
import { price, toUpper, toLower } from '@utils/format'
import { logEvent } from '@utils/amplitude'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { IWallet, getWallets } from '@utils/wallet'
import { getExplorerLink } from '@utils/address'

// Config
import { ADDRESS_RECEIVE, ADDRESS_COPY, ADDRESS_RECEIVE_SEND } from '@config/events'
import { getCurrency } from '@config/currencies'

// Icons
import privateKeyIcon from '@assets/icons/privateKey.svg'
import linkIcon from '@assets/icons/link.svg'
import plusCircleIcon from '@assets/icons/plusCircle.svg'

// Styles
import Styles from './styles'

interface LocationState {
  name: string
  symbol: string
  address: string
  chain?: string
  contractAddress?: string
}

const Receive: React.FC = () => {
  const {
    state: { name, symbol, address, chain = undefined, contractAddress = undefined },
  } = useLocation<LocationState>()

  const history = useHistory()
  const currency = getCurrency(symbol)

  const { ref, isVisible, setIsVisible } = useVisible(false)
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false)
  const [balance, setBalance] = React.useState<null | number>(null)
  const [estimated, setEstimated] = React.useState<null | number>(null)
  const [privateKey, setPrivateKey] = React.useState<null | string>(null)
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm' | 'privateKey'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [passwordErrorLabel, setPasswordErrorLabel] = React.useState<null | string>(null)
  const [pendingBalance, setPendingBalance] = React.useState<null | number>(null)
  const [dropDownList, setDropDownList] = React.useState<any[]>([])

  React.useEffect(() => {
    logEvent({
      name: ADDRESS_RECEIVE,
    })

    loadBalance()
    getDropDownList()
  }, [])

  React.useEffect(() => {
    if (balance !== null && estimated !== null && isRefreshing) {
      setIsRefreshing(false)
    }
  }, [balance, estimated, isRefreshing])

  const getDropDownList = (): void => {
    const list = [
      {
        icon: { source: privateKeyIcon, width: 18, height: 18 },
        title: 'Show Private key',
      },
      { icon: { source: linkIcon, width: 16, height: 16 }, title: 'View in Explorer' },
    ]

    if (['eth', 'bnb'].indexOf(symbol) !== -1) {
      list.push({
        icon: { source: plusCircleIcon, width: 18, height: 18 },
        title: 'Add token',
      })
    }

    setDropDownList(list)
  }

  const onSend = (): void => {
    logEvent({
      name: ADDRESS_RECEIVE_SEND,
    })

    history.push('/send', {
      symbol,
      address,
      chain: currency?.chain,
    })
  }

  const loadBalance = async (): Promise<void> => {
    const { balance, balance_usd, pending } = await getBalance(address, currency?.chain)

    setBalance(balance)
    setEstimated(balance_usd)
    setPendingBalance(pending)
  }

  const openWebPage = (url: string): Promise<Tabs.Tab> => {
    return browser.tabs.create({ url })
  }

  const onClickDropDown = (index: number) => {
    setIsVisible(false)

    if (index === 0) {
      setActiveDrawer('confirm')
    } else if (index === 1) {
      const link = getExplorerLink(address, symbol, currency, chain, contractAddress)
      openWebPage(link)
    } else if (index === 2) {
      history.push('/select-token', {
        currency,
        address,
      })
    }
  }

  const onRefresh = (): void => {
    if (balance !== null && estimated !== null) {
      setIsRefreshing(true)
      setBalance(null)
      setEstimated(null)

      loadBalance()
    }
  }

  const onCopyAddress = (): void => {
    logEvent({
      name: ADDRESS_COPY,
    })
  }

  const onConfirmModal = (): void => {
    if (passwordErrorLabel) {
      setPasswordErrorLabel(null)
    }

    if (validatePassword(password)) {
      const backup = localStorage.getItem('backup')

      if (backup?.length) {
        const decryptBackup = decrypt(backup, password)

        if (decryptBackup) {
          const parseBackup = JSON.parse(decryptBackup)
          const findWallet = parseBackup?.wallets?.find(
            (wallet: IWallet) => toLower(wallet.address) === toLower(address)
          )

          if (findWallet) {
            setPrivateKey(findWallet.privateKey)
            return setActiveDrawer('privateKey')
          }
        }
      }
    }

    return setPasswordErrorLabel('Password is not valid')
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Home" />
        <Styles.Container>
          <Styles.Row>
            <Styles.Heading>
              <Styles.UpdateBalanceBlock>
                <Styles.BalanceLabel>Balance</Styles.BalanceLabel>
                <Styles.RefreshIconRow isRefreshing={isRefreshing} onClick={onRefresh}>
                  <SVG
                    src="../../assets/icons/refresh.svg"
                    width={13}
                    height={13}
                    title="Refresh balance"
                  />
                </Styles.RefreshIconRow>
              </Styles.UpdateBalanceBlock>
              <Styles.MoreButton onClick={() => setIsVisible(!isVisible)}>
                <SVG src="../../assets/icons/more.svg" width={18} height={3.78} title="More" />
              </Styles.MoreButton>
            </Styles.Heading>

            <DropDown
              dropDownRef={ref}
              isVisible={isVisible}
              list={dropDownList}
              onClick={onClickDropDown}
            />

            <Styles.CurrencyBlock>
              <CurrencyLogo symbol={symbol} width={22} height={22} br={5} chain={chain} />
              <Styles.CurrencyName>{name}</Styles.CurrencyName>
            </Styles.CurrencyBlock>

            <Skeleton width={250} height={36} mt={10} type="gray" isLoading={balance === null}>
              <Styles.Balance>
                {numeral(balance).format('0.[000000]')} {toUpper(symbol)}
              </Styles.Balance>
            </Skeleton>

            <Skeleton
              width={130}
              height={23}
              mt={5}
              mb={10}
              type="gray"
              isLoading={estimated === null}
            >
              {estimated !== null ? (
                <Styles.Estimated>{`$${price(estimated, 2)} USD`}</Styles.Estimated>
              ) : null}
            </Skeleton>

            {pendingBalance !== null && Number(pendingBalance) !== 0 ? (
              <PendingBalance btcValue={pendingBalance} type="gray" symbol={symbol} />
            ) : null}
          </Styles.Row>

          <Styles.ReceiveBlock>
            <QRCode size={120} value={address} />
            <CopyToClipboard value={address} mb={20} onCopy={onCopyAddress}>
              <Styles.Address>{address}</Styles.Address>
            </CopyToClipboard>
            <Button label={`Send ${toUpper(symbol)}`} onClick={onSend} />
          </Styles.ReceiveBlock>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={activeDrawer === 'confirm'}
        onClose={() => setActiveDrawer(null)}
        title="Confirm showing private key"
        isButtonDisabled={!validatePassword(password)}
        onConfirm={onConfirmModal}
        textInputValue={password}
        onChangeText={setPassword}
        inputLabel="Enter password"
        textInputType="password"
        inputErrorLabel={passwordErrorLabel}
      />
      <ShowPrivateKeyDrawer
        isActive={activeDrawer === 'privateKey'}
        onClose={() => {
          setActiveDrawer(null)
          setPrivateKey(null)
        }}
        privateKey={privateKey}
      />
    </>
  )
}

export default Receive
