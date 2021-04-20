import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { v4 } from 'uuid'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'
import TokenCard from '@components/TokenCard'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'

// Utils
import { validatePassword } from '@utils/validate'
import { decrypt, encrypt } from '@utils/crypto'
import { addNew as addNewWallet, IWallet } from '@utils/wallet'
import { importPrivateKey } from '@utils/address'
import { toLower, toUpper } from '@utils/format'
import { setUserProperties } from '@utils/amplitude'

// Styles
import Styles from './styles'

interface LocationState {
  chain: string
  symbol: TSymbols
  privateKey: string
  tokens: string[]
  tokenName?: string
  contractAddress?: string
}

const FoundTokens: React.FC = () => {
  const history = useHistory()
  const {
    state: {
      chain,
      symbol,
      privateKey,
      tokens,
      tokenName = undefined,
      contractAddress = undefined,
    },
  } = useLocation<LocationState>()

  const [selectedTokens, setSelectedTokens] = React.useState<string[]>(tokens)
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)
  const [isIncludeTokens, setIsIncludeTokens] = React.useState<boolean>(false)

  const onToggle = (tokenSymbol: string, isActive: boolean): void => {
    if (isActive) {
      setSelectedTokens(selectedTokens.filter((token: string) => token !== tokenSymbol))
    } else {
      setSelectedTokens([...selectedTokens, tokenSymbol])
    }
  }

  const onConfirm = (includeTokens: boolean): void => {
    setIsIncludeTokens(includeTokens)
    setActiveDrawer('confirm')
  }

  const getNewWallets = (
    decryptBackup: string,
    address: string,
    password: string
  ): string | null => {
    const parseBackup = JSON.parse(decryptBackup)
    let newWalletsList: string | null = ''

    const tokensList = isIncludeTokens ? [...tokens, symbol] : [symbol]

    for (const [index, token] of tokensList.entries()) {
      const uuid = v4()

      const getTokenName = index == 0 && tokenName ? tokenName : undefined
      const getContractAddress = index === 0 && contractAddress ? contractAddress : undefined

      newWalletsList = addNewWallet(address, token, uuid, chain, getTokenName, getContractAddress)

      parseBackup.wallets.push({
        symbol: toLower(token),
        address,
        uuid,
        privateKey,
        chain,
        tokenName: getTokenName,
        contractAddress: getContractAddress,
      })

      localStorage.setItem('backup', encrypt(JSON.stringify(parseBackup), password))
      localStorage.setItem('wallets', `${newWalletsList}`)
    }

    return newWalletsList
  }

  const onConfirmDrawer = (): void => {
    if (errorLabel) {
      setErrorLabel(null)
    }

    if (validatePassword(password)) {
      const backup = localStorage.getItem('backup')

      if (backup) {
        const decryptBackup = decrypt(backup, password)

        if (decryptBackup) {
          const address = importPrivateKey(symbol, privateKey, chain)

          if (address) {
            const walletsList = getNewWallets(decryptBackup, address, password)

            if (walletsList) {
              const walletAmount = JSON.parse(walletsList).filter(
                (wallet: IWallet) => wallet.symbol === symbol
              ).length
              setUserProperties({ [`NUMBER_WALLET_${toUpper(symbol)}`]: `${walletAmount}` })

              localStorage.setItem('backupStatus', 'notDownloaded')

              history.replace('/download-backup', {
                password,
                from: 'foundTokens',
              })
            }
          }
        }
      }
    }
    return setErrorLabel('Password is not valid')
  }

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle="Import private key" />
        <Styles.Container>
          <Styles.Row>
            <Styles.Title>Found tokens</Styles.Title>
            <Styles.Description>
              We found these ERC20 tokens on your address. Do you want to add them to your wallet?
            </Styles.Description>

            <Styles.TokensList>
              <TokenCard symbol={symbol} chain={chain} hideSelect />

              {tokens.map((tokenSymbol: string) => {
                const isActive = selectedTokens.indexOf(tokenSymbol) !== -1

                return (
                  <TokenCard
                    symbol={tokenSymbol}
                    chain={chain}
                    isActive={isActive}
                    onToggle={() => onToggle(tokenSymbol, isActive)}
                  />
                )
              })}
            </Styles.TokensList>
          </Styles.Row>

          <Styles.Actions>
            <Button label="Skip" isLight isSmall mr={7.5} onClick={() => onConfirm(false)} />
            <Button label="Ok" isSmall ml={7.5} onClick={() => onConfirm(true)} />
          </Styles.Actions>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={activeDrawer === 'confirm'}
        onClose={() => setActiveDrawer(null)}
        title="Confirm adding new address"
        inputLabel="Enter password"
        textInputValue={password}
        isButtonDisabled={!validatePassword(password)}
        onConfirm={onConfirmDrawer}
        onChangeText={setPassword}
        textInputType="password"
        inputErrorLabel={errorLabel}
      />
    </>
  )
}

export default FoundTokens
