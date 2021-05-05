import * as React from 'react'
import { render } from 'react-dom'
import SVG from 'react-inlinesvg'
import { browser } from 'webextension-polyfill-ts'

// Components
import Cover from '@components/Cover'
import WalletCard from '@components/WalletCard'
import CurrenciesDropdown from '@components/CurrenciesDropdown'
import TextInput from '@components/TextInput'
import Button from '@components/Button'
import OneTimePassword from '@components/OneTimePassword'

// Utils
import { getWallets, IWallet } from '@utils/wallet'
import { validatePassword } from '@utils/validate'
import { decrypt, sha256hash } from '@utils/crypto'
import { toLower, toUpper, unique } from '@utils/format'

// Config
import { getCurrency } from '@config/currencies'
import { getToken } from '@config/tokens'

// Styles
import Styles from './styles/selectAddress.page'

type TSelectedCurrency = {
  symbol: string
  name: string
  background: string
  chain?: string
}

const SelectAddress: React.FC = () => {
  const [wallets, setWallets] = React.useState<null | IWallet[]>(null)
  const [siteUrl, setSiteUrl] = React.useState<null | string>(null)
  const [siteFavicon, setSiteFavicon] = React.useState<null | string>(null)
  const [isFiltersActive, setFiltersActive] = React.useState<boolean>(false)
  const [password, setPassword] = React.useState<string>('')
  const [passwordErrorLabel, setPasswordErrorLabel] = React.useState<null | string>(null)
  const [isUnlocked, setUnlocked] = React.useState<boolean>(false)
  const [passcode, setPasscode] = React.useState<string>('')
  const [isPasscodeError, setPasscodeError] = React.useState<boolean>(false)
  const [selectedCurrency, setSelectedCurrency] = React.useState<TSelectedCurrency | null>(null)

  const textInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    getWalletsList()
    getRequesterSiteInfo()
    getInitialCurrency()

    if (localStorage.getItem('isLocked') && !localStorage.getItem('passcode')) {
      textInputRef.current?.focus()
    }
  }, [])

  React.useEffect(() => {
    if (passcode.length === 6) {
      checkPasscode()
    }
  }, [passcode])

  const getInitialCurrency = (): void => {
    const searchParams = new URLSearchParams(location.search)

    const queryCurrency = searchParams.get('currency')
    const queryChain = searchParams.get('chain')

    const parseChain = queryChain !== 'null' && queryChain !== null ? queryChain : null

    if (queryCurrency !== 'null' && queryCurrency !== null) {
      const getCurrencyInfo = parseChain
        ? getToken(queryCurrency, parseChain)
        : getCurrency(queryCurrency)

      if (getCurrencyInfo) {
        const { symbol, name, background } = getCurrencyInfo

        setSelectedCurrency({
          symbol,
          name,
          background,
          chain: parseChain || undefined,
        })
      }
    }
  }

  const checkPasscode = (): void => {
    const getPasscodeHash = localStorage.getItem('passcode')

    if (getPasscodeHash && getPasscodeHash === sha256hash(passcode)) {
      localStorage.removeItem('isLocked')
      setUnlocked(true)
    } else {
      setPasscodeError(true)
      setPasscode('')
    }
  }

  const getRequesterSiteInfo = (): void => {
    const data = localStorage.getItem('requesterSite')

    if (data) {
      const parseData = JSON.parse(data)

      if (parseData.url) {
        setSiteUrl(parseData.url)
      }

      if (parseData.favicon) {
        setSiteFavicon(parseData.favicon)
      }
    }
  }

  const getWalletsList = () => {
    const walletsList = getWallets()

    if (walletsList) {
      setWallets(walletsList)
    }
  }

  const onClose = (): void => {
    window.close()
  }

  const handleClick = (address: string) => {
    browser.runtime.sendMessage({
      type: 'set_address',
      data: {
        address,
      },
    })
    onClose()
  }

  const onSelectCurrency = (index: number): void => {
    const currency = getDropdownList()[index]
    const getCurrencyInfo = currency.logo?.chain
      ? getToken(currency.logo.symbol, currency.logo.chain)
      : getCurrency(currency.logo.symbol)

    if (getCurrencyInfo) {
      const { symbol, name, background, chain } = getCurrencyInfo

      setSelectedCurrency({
        symbol,
        name,
        background,
        chain: currency.logo.chain || undefined,
      })
    }
  }

  const getDropdownList = () => {
    const walletsList = getWallets()

    if (walletsList?.length) {
      const mapWallets = walletsList
        .filter(
          (v, i, a) =>
            a.findIndex(
              (wallet: IWallet) => wallet.symbol === v.symbol && wallet.chain === v.chain
            ) === i
        )
        .filter(
          (wallet: IWallet) =>
            toLower(wallet.symbol) !== toLower(selectedCurrency?.symbol) ||
            toLower(wallet.chain) !== toLower(selectedCurrency?.chain)
        )

      return mapWallets.map((wallet: IWallet) => {
        const getCurrencyInfo = wallet?.chain
          ? getToken(wallet.symbol, wallet.chain)
          : getCurrency(wallet.symbol)

        return {
          logo: {
            symbol: wallet?.symbol,
            width: 40,
            height: 40,
            br: 13,
            background: getCurrencyInfo?.background || '',
            chain: wallet.chain,
          },
          value: getCurrencyInfo?.name || '',
        }
      })
    }
    return []
  }

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const onUnlock = (): void => {
    if (passwordErrorLabel) {
      setPasswordErrorLabel(null)
    }

    if (validatePassword(password)) {
      const backup = localStorage.getItem('backup')

      if (backup) {
        const decryptWallet = decrypt(backup, password)

        if (decryptWallet) {
          localStorage.removeItem('isLocked')
          setUnlocked(true)
        }
      }
    }

    return setPasswordErrorLabel('Password is not valid')
  }

  const filterWallets = wallets?.filter((wallet: IWallet) => {
    if (selectedCurrency) {
      return (
        toLower(wallet.symbol) === toLower(selectedCurrency.symbol) &&
        toLower(wallet?.chain) === toLower(selectedCurrency?.chain)
      )
    }
    return wallet
  })

  const renderPage = () => (
    <Styles.Body>
      <Styles.Row>
        <Styles.Title>Select Address</Styles.Title>

        {siteUrl || siteFavicon ? (
          <Styles.SiteBlock>
            <Styles.UseOn>To use it on </Styles.UseOn>

            <Styles.SiteInfo>
              {siteFavicon && siteUrl ? (
                <Styles.SiteFavicon src={`https://${siteUrl}${siteFavicon}`} />
              ) : null}
              {siteUrl ? <Styles.SiteUrl>{siteUrl}</Styles.SiteUrl> : null}
            </Styles.SiteInfo>
          </Styles.SiteBlock>
        ) : null}
      </Styles.Row>

      <Styles.Addresses>
        <Styles.AddressesRow>
          <Styles.AddressesLabel>
            {selectedCurrency ? `My ${toUpper(selectedCurrency.symbol)} addresses` : 'My addresses'}
          </Styles.AddressesLabel>
          <Styles.FiltersButton
            onClick={() => setFiltersActive((prevState: boolean) => !prevState)}
            isActive={isFiltersActive}
          >
            <SVG src="./assets/icons/filter.svg" width={20} height={16} />
          </Styles.FiltersButton>
        </Styles.AddressesRow>

        <Styles.FiltersRow isActive={isFiltersActive}>
          <CurrenciesDropdown
            label="Select currency"
            value={selectedCurrency?.name}
            currencySymbol={selectedCurrency?.symbol}
            background={selectedCurrency?.background}
            tokenChain={selectedCurrency?.chain}
            list={getDropdownList()}
            onSelect={onSelectCurrency}
            currencyBr={13}
            disabled={getDropdownList().length < 1 && selectedCurrency !== null}
          />
        </Styles.FiltersRow>

        {filterWallets?.length ? (
          <Styles.AddressesList>
            {filterWallets.map((wallet: IWallet, index: number) => {
              const { address, symbol, chain, name, contractAddress, decimals } = wallet

              return (
                <WalletCard
                  key={`${address}/${index}`}
                  address={address}
                  chain={chain}
                  symbol={symbol.toLowerCase()}
                  name={name}
                  contractAddress={contractAddress}
                  decimals={decimals}
                  handleClick={() => handleClick(address)}
                />
              )
            })}
          </Styles.AddressesList>
        ) : (
          <Styles.NotFound>Addresses was not found</Styles.NotFound>
        )}
      </Styles.Addresses>
    </Styles.Body>
  )

  const renderLock = () => (
    <Styles.Body>
      <Styles.LockedRow>
        <Styles.LockImage />
        <Styles.LockedTitle>Welcome back!</Styles.LockedTitle>

        <Styles.LockedForm onSubmit={onSubmitForm}>
          {localStorage.getItem('passcode') !== null ? (
            <OneTimePassword value={passcode} onChange={setPasscode} isError={isPasscodeError} />
          ) : (
            <>
              <TextInput
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                errorLabel={passwordErrorLabel}
                inputRef={textInputRef}
                openFrom="browser"
              />
              <Styles.LockedFormActions>
                <Button label="Unlock" onClick={onUnlock} disabled={!validatePassword(password)} />
              </Styles.LockedFormActions>
            </>
          )}
        </Styles.LockedForm>
      </Styles.LockedRow>
    </Styles.Body>
  )

  return (
    <Styles.Wrapper>
      <style
        dangerouslySetInnerHTML={{
          __html: `body { padding: 0; margin: 0;font-family: 'Roboto', sans-serif;}`,
        }}
      />
      <Styles.Extension>
        <Cover />
        <Styles.Header>
          <Styles.Logo>
            <SVG src="./assets/logo.svg" width={30} height={24} />
          </Styles.Logo>
          <Styles.CloseButton onClick={onClose}>
            <SVG src="./assets/icons/times.svg" width={16} height={16} />
          </Styles.CloseButton>
        </Styles.Header>

        {localStorage.getItem('isLocked') !== null && !isUnlocked ? renderLock() : renderPage()}
      </Styles.Extension>
    </Styles.Wrapper>
  )
}

render(<SelectAddress />, document.getElementById('select-address'))
