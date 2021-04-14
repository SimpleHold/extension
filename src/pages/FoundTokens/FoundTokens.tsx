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
import { toUpper } from '@utils/format'
import { setUserProperties } from '@utils/amplitude'

// Styles
import Styles from './styles'

interface LocationState {
  chain: string
  symbol: TSymbols
  privateKey: string
  tokens: string[]
}

const FoundTokens: React.FC = () => {
  const history = useHistory()
  const {
    state: { chain, symbol, privateKey, tokens },
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
    address: string
  ): {
    newBackup: string
    walletsList: string | null
  } => {
    const parseBackup = JSON.parse(decryptBackup)
    let newWalletsList: string | null = ''

    for (const token of isIncludeTokens ? [...tokens, symbol] : [symbol]) {
      const uuid = v4()

      newWalletsList = addNewWallet(address, token, uuid, chain)

      parseBackup.wallets.push({
        symbol: token,
        address,
        uuid,
        privateKey,
        chain,
      })
    }

    return {
      newBackup: JSON.stringify(parseBackup),
      walletsList: newWalletsList,
    }
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
            const { newBackup, walletsList } = getNewWallets(decryptBackup, address)

            if (walletsList) {
              localStorage.setItem('backup', encrypt(newBackup, password))
              localStorage.setItem('wallets', walletsList)

              const walletAmount = JSON.parse(walletsList).filter(
                (wallet: IWallet) => wallet.symbol === symbol
              ).length
              setUserProperties({ [`NUMBER_WALLET_${toUpper(symbol)}`]: `${walletAmount}` })

              localStorage.setItem('backupStatus', 'notDownloaded')

              history.push('/download-backup', {
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
