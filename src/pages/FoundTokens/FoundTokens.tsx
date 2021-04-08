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
import { decrypt, encrypt } from '@utils/crypto'

// Styles
import Styles from './styles'

interface LocationState {
  platform: string
  symbol: string
  address: string
  tokens: string[]
}

const FoundTokens: React.FC = () => {
  const history = useHistory()
  const {
    state: { platform, symbol, address, tokens },
  } = useLocation<LocationState>()

  const [selectedTokens, setSelectedTokens] = React.useState<string[]>(tokens)
  const [activeDrawer, setActiveDrawer] = React.useState<null | 'confirm'>(null)
  const [password, setPassword] = React.useState<string>('')
  const [errorLabel, setErrorLabel] = React.useState<null | string>(null)
  const [isIncludeTokens, setIncludeTokens] = React.useState<boolean>(false)

  const onToggle = (tokenSymbol: string, isActive: boolean): void => {
    if (isActive) {
      setSelectedTokens(selectedTokens.filter((token: string) => token !== tokenSymbol))
    } else {
      setSelectedTokens([...selectedTokens, tokenSymbol])
    }
  }

  const onConfirm = (includeTokens: boolean): void => {
    setIncludeTokens(includeTokens)
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
              <TokenCard symbol={symbol} platform={platform} hideSelect />

              {tokens.map((tokenSymbol: string) => {
                const isActive = selectedTokens.indexOf(tokenSymbol) !== -1

                return (
                  <TokenCard
                    symbol={tokenSymbol}
                    platform={platform}
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
