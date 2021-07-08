import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import SVG from 'react-inlinesvg'
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
import Tooltip from '@components/Tooltip'
import Warning from '@components/Warning'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import PrivateKeyDrawer from '@drawers/PrivateKey'
import ExtraIdDrawer from '@drawers/ExtraId'

// Hooks
import useVisible from '@hooks/useVisible'

// Utils
import { getBalance } from '@utils/api'
import { price, toUpper, toLower, short } from '@utils/format'
import { logEvent } from '@utils/amplitude'
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { IWallet, toggleVisibleWallet, updateBalance } from '@utils/wallet'
import { getExplorerLink, getExtraIdName } from '@utils/address'
import { openWebPage } from '@utils/extension'
import { getItem } from '@utils/storage'

// Config
import { ADDRESS_RECEIVE, ADDRESS_COPY, ADDRESS_RECEIVE_SEND } from '@config/events'
import { getCurrency, checkWithPhrase } from '@config/currencies'
import { getToken } from '@config/tokens'

// Icons
import privateKeyIcon from '@assets/icons/privateKey.svg'
import linkIcon from '@assets/icons/link.svg'
import plusCircleIcon from '@assets/icons/plusCircle.svg'
import eyeIcon from '@assets/icons/eye.svg'
import eyeVisibleIcon from '@assets/icons/eyeVisible.svg'
import refreshIcon from '@assets/icons/refresh.svg'
import moreIcon from '@assets/icons/more.svg'
import phraseIcon from '@assets/icons/phrase.svg'

// Styles
import Styles from './styles'

interface LocationState {
  name: string
  symbol: string
  address: string
  chain?: string
  contractAddress?: string
  tokenName?: string
  decimals?: number
  isHidden?: boolean
  hardware?: {
    label: string
    type: 'trezor' | 'ledger'
  }
}

const Receive: React.FC = () => {
  const {
    state: {
      name,
      symbol,
      address,
      chain = undefined,
      contractAddress = undefined,
      tokenName = undefined,
      decimals = undefined,
      isHidden = false,
      hardware = undefined,
    },
  } = useLocation<LocationState>()

  const history = useHistory()
  const currency = chain ? getToken(symbol, chain) : getCurrency(symbol)
  const isCurrencyWithPhrase = checkWithPhrase(symbol)

  const { ref, isVisible, setIsVisible } = useVisible(false)
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false)
  const [balance, setBalance] = React.useState<null | number>(null)
  const [estimated, setEstimated] = React.useState<null | number>(null)
  const [privateKey, setPrivateKey] = React.useState<null | string>(null)
  const [activeDrawer, setActiveDrawer] = React.useState<
    null | 'confirm' | 'privateKey' | 'extraId'
  >(null)
  const [password, setPassword] = React.useState<string>('')
  const [passwordErrorLabel, setPasswordErrorLabel] = React.useState<null | string>(null)
  const [pendingBalance, setPendingBalance] = React.useState<number>(0)
  const [dropDownList, setDropDownList] = React.useState<any[]>([])
  const [isHiddenWallet, setIsHiddenWallet] = React.useState<boolean>(isHidden)
  const [extraIdName, setExtraIdName] = React.useState<string>('')

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
    const list = []

    if (!hardware) {
      list.push({
        icon: isCurrencyWithPhrase
          ? {
              source: phraseIcon,
              width: 16,
              height: 16,
            }
          : { source: privateKeyIcon, width: 18, height: 18 },
        title: isCurrencyWithPhrase ? 'Show recovery phrase' : 'Show Private key',
      })
    }

    list.push({ icon: { source: linkIcon, width: 16, height: 16 }, title: 'View in Explorer' })

    if (['eth', 'bnb'].indexOf(symbol) !== -1) {
      list.push({
        icon: { source: plusCircleIcon, width: 18, height: 18 },
        title: 'Add token',
      })
    }

    const name = getExtraIdName(symbol)

    if (name) {
      setExtraIdName(name)

      list.push({
        icon: { source: plusCircleIcon, width: 18, height: 18 },
        title: 'Generate destination tag',
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
      tokenChain: chain,
      contractAddress,
      tokenName,
      decimals,
      hardware,
    })
  }

  const loadBalance = async (): Promise<void> => {
    const { balance, balance_usd, pending, balance_btc } = await getBalance(
      address,
      currency?.chain || chain,
      chain ? symbol : undefined,
      contractAddress
    )

    setBalance(balance)
    updateBalance(address, symbol, balance, balance_btc)
    setEstimated(balance_usd)
    setPendingBalance(pending)
  }

  const onClickDropDown = (index: number) => {
    setIsVisible(false)

    if (index === 0 && !hardware) {
      setActiveDrawer('confirm')
    } else if (index === 1 || hardware) {
      openWebPage(getExplorerLink(address, symbol, currency, chain, contractAddress))
    } else if (index === 2) {
      if (extraIdName?.length) {
        setActiveDrawer('extraId')
      } else {
        history.push('/select-token', {
          currency,
          address,
        })
      }
    }
  }

  const onRefresh = (): void => {
    if (balance !== null && estimated !== null) {
      setIsRefreshing(true)
      setBalance(null)
      setEstimated(null)
      setPendingBalance(0)

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
      const backup = getItem('backup')

      if (backup?.length) {
        const decryptBackup = decrypt(backup, password)

        if (decryptBackup) {
          const parseBackup = JSON.parse(decryptBackup)
          const findWallet = parseBackup?.wallets?.find(
            (wallet: IWallet) => toLower(wallet.address) === toLower(address)
          )

          if (findWallet) {
            if (findWallet.mnemonic) {
              setPrivateKey(findWallet.mnemonic)
            } else {
              setPrivateKey(findWallet.privateKey)
            }
            return setActiveDrawer('privateKey')
          }
        }
      }
    }

    return setPasswordErrorLabel('Password is not valid')
  }

  const onVisibleWallet = (): void => {
    toggleVisibleWallet(address, symbol, !isHiddenWallet)
    setIsHiddenWallet(!isHiddenWallet)
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Home" />
        <Styles.Container>
          <Styles.Row>
            <Styles.Heading>
              <Styles.Currency>
                <CurrencyLogo
                  symbol={symbol}
                  width={30}
                  height={30}
                  br={8}
                  chain={chain}
                  name={tokenName}
                />
                <Styles.HeadingRow>
                  {hardware ? (
                    <Styles.HardwareBlock>
                      <Styles.HardwareLabel>{hardware.label}</Styles.HardwareLabel>
                      <SVG src="../../assets/icons/trezor.svg" width={8.9} height={13} />
                    </Styles.HardwareBlock>
                  ) : null}
                  <Styles.CurrencyName size={hardware ? 'small' : 'normal'}>
                    {name}
                  </Styles.CurrencyName>
                </Styles.HeadingRow>
              </Styles.Currency>
              <Styles.Actions>
                <Tooltip text={`${isHiddenWallet ? 'Show' : 'Hide'} address`} mt={5}>
                  <Styles.Action onClick={onVisibleWallet}>
                    <SVG src={isHiddenWallet ? eyeVisibleIcon : eyeIcon} width={30} height={30} />
                  </Styles.Action>
                </Tooltip>
                <Styles.Action onClick={() => setIsVisible(!isVisible)}>
                  <SVG src={moreIcon} width={16} height={3.36} />
                </Styles.Action>
              </Styles.Actions>
            </Styles.Heading>

            <DropDown
              dropDownRef={ref}
              isVisible={isVisible}
              list={dropDownList}
              onClick={onClickDropDown}
            />
            <Styles.BalanceRow>
              <Skeleton width={250} height={36} type="gray" isLoading={balance === null}>
                <Styles.Balance>
                  {numeral(balance).format('0.[000000]')} {toUpper(symbol)}
                </Styles.Balance>
              </Skeleton>
              <Styles.RefreshButton onClick={onRefresh} isRefreshing={isRefreshing}>
                <SVG src={refreshIcon} width={16} height={16} />
              </Styles.RefreshButton>
            </Styles.BalanceRow>

            <Skeleton width={130} height={23} mt={10} type="gray" isLoading={estimated === null}>
              {estimated !== null ? (
                <Styles.Estimated>{`$${price(estimated, 2)}`}</Styles.Estimated>
              ) : null}
            </Skeleton>

            {pendingBalance !== 0 ? (
              <Styles.PendingRow>
                <PendingBalance pending={pendingBalance} type="gray" symbol={symbol} />
              </Styles.PendingRow>
            ) : null}

            {balance !== null && balance < 20 && toLower(symbol) === 'xrp' ? (
              <Warning
                text="You need 20 XRP minimum to activate your XRP address."
                color="#3FBB7D"
                br={5}
                mt={10}
                padding="8px 10px"
                background="rgba(211, 236, 221, 0.3)"
              />
            ) : null}
          </Styles.Row>

          <Styles.ReceiveBlock>
            <QRCode size={120} value={address} />
            <CopyToClipboard value={address} onCopy={onCopyAddress}>
              <Styles.Address>{short(address, 70)}</Styles.Address>
            </CopyToClipboard>
            <Button label={`Send ${toUpper(symbol)}`} onClick={onSend} mt={30} />
          </Styles.ReceiveBlock>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={activeDrawer === 'confirm'}
        onClose={() => setActiveDrawer(null)}
        title={`Please enter your password to see the ${
          isCurrencyWithPhrase ? 'recovery phrase' : 'private key'
        }`}
        isButtonDisabled={!validatePassword(password)}
        onConfirm={onConfirmModal}
        textInputValue={password}
        onChangeText={setPassword}
        inputLabel="Enter password"
        textInputType="password"
        inputErrorLabel={passwordErrorLabel}
      />
      <PrivateKeyDrawer
        isMnemonic={isCurrencyWithPhrase}
        isActive={activeDrawer === 'privateKey'}
        onClose={() => {
          setActiveDrawer(null)
          setPrivateKey(null)
        }}
        privateKey={privateKey}
      />
      <ExtraIdDrawer
        isActive={activeDrawer === 'extraId'}
        onClose={() => setActiveDrawer(null)}
        title={extraIdName}
        symbol={symbol}
      />
    </>
  )
}

export default Receive
