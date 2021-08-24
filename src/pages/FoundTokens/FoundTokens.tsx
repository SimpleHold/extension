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
import { importPrivateKey } from '@utils/currencies'
import { getItem, setItem } from '@utils/storage'

// Config
import { getCurrencyByChain } from '@config/currencies'

// Hooks
import useState from '@hooks/useState'

// Types
import { IState, ILocationState } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  selectedTokens: [],
  activeDrawer: null,
  password: '',
  errorLabel: null,
  isIncludeTokens: false,
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
  } = useLocation<ILocationState>()

  const { state, updateState } = useState({
    ...initialState,
    selectedTokens: tokens,
  })

  const onToggle = (tokenSymbol: string, isActive: boolean): void => {
    if (isActive) {
      updateState({
        selectedTokens: state.selectedTokens.filter((token: string) => token !== tokenSymbol),
      })
    } else {
      updateState({
        selectedTokens: [...state.selectedTokens, tokenSymbol],
      })
    }
  }

  const onConfirm = (isIncludeTokens: boolean): void => {
    updateState({ activeDrawer: 'confirm', isIncludeTokens })
  }

  const onConfirmDrawer = (): void => {
    if (state.errorLabel) {
      updateState({ errorLabel: null })
    }

    if (validatePassword(state.password)) {
      const backup = getItem('backup')

      if (backup) {
        const decryptBackup = decrypt(backup, state.password)

        if (decryptBackup) {
          const address = importPrivateKey(symbol, privateKey, chain)
          const getCurrencyInfo = getCurrencyByChain(chain)

          if (address && getCurrencyInfo) {
            const tokensList = [symbol, getCurrencyInfo.symbol]

            if (state.isIncludeTokens) {
              tokensList.push(...tokens)
            }
            const walletsList = addNewWallet(
              address,
              privateKey,
              decryptBackup,
              state.password,
              tokensList,
              true,
              chain,
              tokenName,
              contractAddress,
              decimals
            )

            if (walletsList) {
              setItem('backupStatus', 'notDownloaded')

              history.replace('/download-backup', {
                password: state.password,
                from: 'foundTokens',
              })
            }
          }
        }
      }
    }
    updateState({ errorLabel: 'Password is not valid' })
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const setPassword = (password: string): void => {
    updateState({ password })
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
                const isActive = state.selectedTokens.indexOf(tokenSymbol) !== -1

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
            <Button label="Skip" isLight mr={7.5} onClick={() => onConfirm(false)} />
            <Button label="Ok" ml={7.5} onClick={() => onConfirm(true)} />
          </Styles.Actions>
        </Styles.Container>
      </Styles.Wrapper>
      <ConfirmDrawer
        isActive={state.activeDrawer === 'confirm'}
        onClose={onCloseDrawer}
        title="Please enter your password to add a new address"
        inputLabel="Enter password"
        textInputValue={state.password}
        isButtonDisabled={!validatePassword(state.password)}
        onConfirm={onConfirmDrawer}
        onChangeText={setPassword}
        textInputType="password"
        inputErrorLabel={state.errorLabel}
      />
    </>
  )
}

export default FoundTokens
