import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Link from '@components/Link'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'
import SuccessDrawer from '@drawers/Success'

// Utils
import { validatePassword } from '@utils/validate'
import { checkExistWallet, addNew as addNewWallet, IWallet, getWallets } from '@utils/wallet'
import { decrypt } from '@utils/crypto'
import { setUserProperties } from '@utils/amplitude'
import { toLower, toUpper } from '@utils/format'
import { importPrivateKey } from '@utils/currencies'
import { getTokensBalance } from '@utils/api'
import { ITokensBalance } from '@utils/api/types'
import * as theta from '@utils/currencies/theta'
import { getItem, setItem } from '@utils/storage'

// Config
import tokens, { IToken } from '@config/tokens'
import { getCurrencyByChain, ICurrency } from '@config/currencies'

// Styles
import Styles from './styles'

interface LocationState {
  symbol: string
  chain?: string
  tokenName?: string
  contractAddress?: string
  decimals?: number
}

const ImportPrivateKey: React.FC = () => {
  const [privateKey, setPrivateKey] = React.useState<string>('')
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm' | 'success'>(null)
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)
  const [password, setPassword] = React.useState<string>('')
  const [isImportButtonLoading, setImportButtonLoading] = React.useState<boolean>(false)

  const history = useHistory()
  const {
    state: {
      symbol,
      chain = undefined,
      tokenName = undefined,
      contractAddress = undefined,
      decimals = undefined,
    },
  } = useLocation<LocationState>()

  const textInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    textInputRef.current?.focus()
  }, [])

  const onConfirm = async (isSkipFindTokens?: boolean): Promise<void> => {
    if (errorLabel) {
      setErrorLabel(null)
    }

    const getAddress = importPrivateKey(symbol, privateKey, chain)

    if (getAddress) {
      const checkExist = checkExistWallet(getAddress, symbol, chain)

      if (checkExist) {
        return setErrorLabel('This address has already been added')
      }

      if (chain && !isSkipFindTokens) {
        return await findAddressTokens(getAddress, privateKey)
      }
      return setActiveDrawer('confirm')
    }

    return setErrorLabel('Invalid private key')
  }

  const findAddressTokens = async (address: string, privateKey: string): Promise<void> => {
    if (chain) {
      setImportButtonLoading(true)

      const data = await getTokensBalance(address, chain)
      const filterData = data?.filter((item) => toLower(item.symbol) !== toLower(symbol))

      setImportButtonLoading(false)
      const wallets = getWallets()

      if (filterData?.length && wallets) {
        const mapTokens = filterData.map((token: ITokensBalance) => token.symbol)
        const mapExistTokens = tokens.map((token: IToken) => token.symbol)
        const filterByExistTokens = mapTokens.filter((token: string) =>
          mapExistTokens.includes(token)
        )
        const mapWalletsExistTokens = wallets
          .filter(
            (wallet: IWallet) =>
              toLower(wallet.chain) === toLower(chain) &&
              filterByExistTokens.includes(wallet.symbol)
          )
          .map((wallet: IWallet) => wallet.symbol)
        const removeDuplicates = filterByExistTokens.filter(
          (i) => !mapWalletsExistTokens.includes(i)
        )

        if (removeDuplicates.length) {
          return history.push('/found-tokens', {
            chain,
            symbol: toLower(symbol),
            privateKey,
            tokens: removeDuplicates,
            tokenName,
            contractAddress,
            decimals,
            tokenStandart: toLower(chain) === 'bsc' ? 'BEP20' : 'ERC20',
          })
        }
      }

      return onConfirm(true)
    }
  }

  const getCurrenciesList = (getCurrencyInfo?: ICurrency | undefined | null): string[] => {
    if (theta.coins.indexOf(symbol) !== -1) {
      return theta.coins.sort((a: string, b: string) => a.indexOf(symbol) - b.indexOf(symbol))
    } else if (chain && getCurrencyInfo) {
      return [symbol, getCurrencyInfo.symbol]
    }
    return [symbol]
  }

  const onConfirmDrawer = (): void => {
    const backup = getItem('backup')

    if (backup && privateKey) {
      const decryptBackup = decrypt(backup, password)
      if (decryptBackup) {
        const address = importPrivateKey(symbol, privateKey, chain)

        if (address) {
          const getCurrencyInfo = chain ? getCurrencyByChain(chain) : null
          const currenciesList = getCurrenciesList(getCurrencyInfo)

          const walletsList = addNewWallet(
            address,
            privateKey,
            decryptBackup,
            password,
            currenciesList,
            false,
            chain,
            tokenName,
            contractAddress,
            decimals
          )

          if (walletsList) {
            setItem('backupStatus', 'notDownloaded')

            const walletAmount = JSON.parse(walletsList).filter(
              (wallet: IWallet) => wallet.symbol === symbol
            ).length
            setUserProperties({ [`NUMBER_WALLET_${toUpper(symbol)}`]: `${walletAmount}` })

            return setActiveDrawer('success')
          }
        }
      }
    }
    return setErrorLabel('Password is not valid')
  }

  const onDownloadBackup = (): void => {
    return history.replace('/download-backup', {
      password,
      from: 'privateKey',
    })
  }

  const onCloseDrawer = (): void => {
    setActiveDrawer(null)
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Add address" />
        <Styles.Container>
          <Styles.Heading>
            <Styles.Title>Import a private key</Styles.Title>
            <Styles.Description>
              Use your existing address to receive and send crypto. Just enter a private key of this
              address to import it into SimpleHold.
            </Styles.Description>
            <Link
              to="https://simplehold.freshdesk.com/support/solutions/articles/69000197144-what-is-simplehold-"
              title="How it works?"
              mt={30}
            />
          </Styles.Heading>
          <Styles.Form>
            <TextInput
              label="Enter key"
              value={privateKey}
              onChange={setPrivateKey}
              errorLabel={errorLabel}
              inputRef={textInputRef}
              type="text"
            />
            <Styles.Actions>
              <Button label="Back" isLight onClick={history.goBack} mr={7.5} />
              <Button
                label="Import"
                disabled={!privateKey.length}
                onClick={onConfirm}
                ml={7.5}
                isLoading={isImportButtonLoading}
              />
            </Styles.Actions>
          </Styles.Form>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={activeDrawer === 'confirm'}
        onClose={onCloseDrawer}
        title="Please enter your password to add a new address"
        inputLabel="Enter password"
        textInputValue={password}
        isButtonDisabled={!validatePassword(password)}
        onConfirm={onConfirmDrawer}
        onChangeText={setPassword}
        textInputType="password"
        inputErrorLabel={errorLabel}
      />
      <SuccessDrawer
        isActive={activeDrawer === 'success'}
        onClose={onDownloadBackup}
        text="The new address has been successfully added!"
      />
    </>
  )
}

export default ImportPrivateKey
