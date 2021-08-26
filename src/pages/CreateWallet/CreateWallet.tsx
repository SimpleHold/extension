import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import TextInput from '@components/TextInput'
import Button from '@components/Button'
import Link from '@components/Link'
import AgreeTerms from '@components/AgreeTerms'

// Utils
import { validatePassword } from '@utils/validate'
import { logEvent, setUserProperties } from '@utils/amplitude'
import { generate as generateBackup } from '@utils/backup'
import { encrypt } from '@utils/crypto'
import { generate as generateAddress } from '@utils/currencies'
import { setItem } from '@utils/storage'
import { getAllCookies, Cookie } from '@utils/extension'
import * as theta from '@utils/currencies/theta'

// Config
import { START_PASSWORD } from '@config/events'
import { getCurrency, getCurrencyByChain } from '@config/currencies'
import { getToken } from '@config/tokens'

// Hooks
import useState from '@hooks/useState'

// Types
import { IState } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  password: '',
  confirmPassword: '',
  isAgreed: true,
  passwordErrorLabel: null,
  confirmPasswordErrorLabel: null,
  initialCurrencies: [
    {
      symbol: 'btc',
    },
  ],
}

const Wallets: React.FC = () => {
  const history = useHistory()

  const { state, updateState } = useState<IState>(initialState)

  const passwordInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    passwordInputRef.current?.focus()

    getCookies()
  }, [])

  const getCookies = async () => {
    const cookies = await getAllCookies('https://simplehold.io')
    const getCookieCurrency = cookies.find((cookie: Cookie) => cookie.name === 'currency')

    if (getCookieCurrency) {
      const { value } = getCookieCurrency

      if (value.indexOf('_') !== -1) {
        const [tokenSymbol, tokenChain] = value.split('_')

        const findCurrency = getCurrencyByChain(tokenChain)
        const findToken = getToken(tokenSymbol, tokenChain)

        if (findCurrency && findToken) {
          updateState({
            initialCurrencies: [
              {
                symbol: findToken.symbol,
                chain: findToken.chain,
              },
              {
                symbol: findCurrency.symbol,
              },
            ],
          })
        }
      } else {
        const findCurrency = getCurrency(value)

        if (findCurrency) {
          const { symbol } = findCurrency

          if (theta.coins.indexOf(symbol) !== -1) {
            updateState({ initialCurrencies: [{ symbol: 'theta' }, { symbol: 'tfuel' }] })
          } else {
            updateState({
              initialCurrencies: [
                {
                  symbol,
                },
              ],
            })
          }
        }
      }
    }
  }

  const isButtonDisabled =
    state.password.length < 7 || state.password !== state.confirmPassword || !state.isAgreed

  const onConfirm = async (): Promise<void> => {
    logEvent({
      name: START_PASSWORD,
    })

    let data = []

    for (const currency of state.initialCurrencies) {
      const { symbol, chain } = currency
      const generate = await generateAddress(symbol, chain)

      if (generate) {
        data.push({
          symbol,
          chain,
          data: generate,
        })
      }
    }

    const { backup, wallets } = generateBackup(data)

    setItem('backup', encrypt(backup, state.password))
    setItem('wallets', wallets)
    setItem('backupStatus', 'notDownloaded')

    setUserProperties({
      NUMBER_WALLET_BTC: '1',
    })

    history.replace('/download-backup')
  }

  const onBlurPassword = (): void => {
    if (state.passwordErrorLabel) {
      updateState({ passwordErrorLabel: null })
    }

    if (!validatePassword(state.password)) {
      updateState({ passwordErrorLabel: 'Password must be at least 8 symbols' })
    }
  }

  const onBlurConfirmPassword = (): void => {
    if (state.confirmPasswordErrorLabel) {
      updateState({ confirmPasswordErrorLabel: null })
    }

    if (state.confirmPassword.length && state.confirmPassword !== state.password) {
      updateState({ confirmPasswordErrorLabel: "Passwords don't match" })
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      if (!isButtonDisabled) {
        onConfirm()
      }
    }
  }

  const setPassword = (password: string): void => {
    updateState({ password })
  }

  const setConfirmPassword = (confirmPassword: string): void => {
    updateState({ confirmPassword })
  }

  const toggleAgreed = (): void => {
    updateState({ isAgreed: !state.isAgreed })
  }

  return (
    <Styles.Wrapper>
      <Header noActions logoColor="#3FBB7D" withBorder />
      <Styles.Container>
        <Styles.Row>
          <Styles.Title>Create password</Styles.Title>
          <Styles.Description>
            The password is needed to encrypt your backup with private keys. Be careful and don't
            lose your password as it's impossible to restore it.
          </Styles.Description>
          <Link
            title="How it works?"
            to="https://simplehold.freshdesk.com/support/solutions/articles/69000197144-what-is-simplehold-"
            mt={14}
          />
        </Styles.Row>
        <Styles.Form onKeyDown={onKeyDown}>
          <TextInput
            label="Enter password"
            value={state.password}
            onChange={setPassword}
            type="password"
            errorLabel={state.passwordErrorLabel}
            onBlurInput={onBlurPassword}
            inputRef={passwordInputRef}
          />
          <TextInput
            label="Confirm password"
            value={state.confirmPassword}
            onChange={setConfirmPassword}
            type="password"
            errorLabel={state.confirmPasswordErrorLabel}
            onBlurInput={onBlurConfirmPassword}
          />
          <AgreeTerms isAgreed={state.isAgreed} setIsAgreed={toggleAgreed} mt={20} />
          <Styles.Actions>
            <Button label="Back" onClick={history.goBack} isLight mr={7.5} />
            <Button label="Confirm" onClick={onConfirm} disabled={isButtonDisabled} ml={7.5} />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Wallets
