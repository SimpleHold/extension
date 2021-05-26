import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'
import TokenCard from '@components/TokenCard'

// Drawers
import ConfirmDrawer from '@drawers/Confirm'

// Utils
import { validatePassword } from '@utils/validate'
import { decrypt } from '@utils/crypto'
import { addNew as addNewWallet } from '@utils/wallet'
import { importPrivateKey } from '@utils/address'

// Config
import { getCurrencyByChain } from '@config/currencies'

// Styles
import Styles from './styles'

interface LocationState {
  chain: string
  symbol: TSymbols
  privateKey: string
  tokens: string[]
  tokenStandart: string
  tokenName?: string
  contractAddress?: string
  decimals: number
}

const FoundTokens: React.FC = () => {
  const history = useHistory()
  const {
    state: {
      chain,
      symbol,
      privateKey,
      tokens,
      tokenStandart,
      tokenName = undefined,
      contractAddress = undefined,
      decimals = undefined,
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
          const getCurrencyInfo = getCurrencyByChain(chain)

          if (address && getCurrencyInfo) {
            const tokensList = [symbol, getCurrencyInfo.symbol]

            if (isIncludeTokens) {
              tokensList.push(...tokens)
            }
            const walletsList = addNewWallet(
              address,
              privateKey,
              decryptBackup,
              password,
              tokensList,
              true,
              chain,
              tokenName,
              contractAddress,
              decimals
            )

            if (walletsList) {
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
              We found these {tokenStandart} tokens on your address. Do you want to add them to your
              wallet?
            </Styles.Description>

            <Styles.TokensList>
              <TokenCard symbol={symbol} chain={chain} hideSelect name={tokenName} />

              {tokens.map((tokenSymbol: string) => {
                const isActive = selectedTokens.indexOf(tokenSymbol) !== -1

                return (
                  <TokenCard
                    symbol={tokenSymbol}
                    chain={chain}
                    isActive={isActive}
                    onToggle={() => onToggle(tokenSymbol, isActive)}
                    key={tokenSymbol}
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
        title="Please enter your password to add a new address"
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
