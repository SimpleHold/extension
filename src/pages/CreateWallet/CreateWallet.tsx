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
import { generate } from '@utils/backup'
import { encrypt } from '@utils/crypto'
import { generate as generateAddress } from '@utils/address'
import { setItem } from '@utils/storage'
import { getAllCookies, Cookie } from '@utils/extension'
import * as theta from '@utils/currencies/theta'

// Config
import { START_PASSWORD } from '@config/events'
import { getCurrency, getCurrencyByChain } from '@config/currencies'
import { getToken } from '@config/tokens'

// Styles
import Styles from './styles'

type TInitialCurrency = {
  symbol: string
  chain?: string
}

const Wallets: React.FC = () => {
  const history = useHistory()

  const [password, setPassword] = React.useState<string>('')
  const [confirmPassword, setConfirmPassword] = React.useState<string>('')
  const [isAgreed, setIsAgreed] = React.useState<boolean>(true)
  const [passwordErrorLabel, setPasswordErrorLabel] = React.useState<null | string>(null)
  const [confirmPasswordErrorLabel, setConfirmPasswordErrorLabel] = React.useState<null | string>(
    null
  )
  const [initialCurrencies, setInitialCurrencies] = React.useState<TInitialCurrency[]>([
    {
      symbol: 'btc',
    },
  ])

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
          setInitialCurrencies([
            {
              symbol: findToken.symbol,
              chain: findToken.chain,
            },
            {
              symbol: findCurrency.symbol,
            },
          ])
        }
      } else {
        const findCurrency = getCurrency(value)

        if (findCurrency) {
          const { symbol } = findCurrency

          if (theta.coins.indexOf(symbol) !== -1) {
            setInitialCurrencies([{ symbol: 'theta' }, { symbol: 'tfuel' }])
          } else {
            setInitialCurrencies([
              {
                symbol,
              },
            ])
          }
        }
      }
    }
  }

  const isButtonDisabled = password.length < 7 || password !== confirmPassword || !isAgreed

  const onConfirm = (): void => {
    logEvent({
      name: START_PASSWORD,
    })

    let data = []

    for (const currency of initialCurrencies) {
      const { symbol, chain } = currency
      const generate = generateAddress(symbol, chain)

      if (generate) {
        data.push({
          symbol,
          chain,
          data: generate,
        })
      }
    }

    const { backup, wallets } = generate(data)

    setItem('backup', encrypt(backup, password))
    setItem('wallets', wallets)
    setItem('backupStatus', 'notDownloaded')

    setUserProperties({
      NUMBER_WALLET_BTC: '1',
    })

    history.replace('/download-backup')
  }

  const onBlurPassword = (): void => {
    if (passwordErrorLabel) {
      setPasswordErrorLabel(null)
    }

    if (!validatePassword(password)) {
      setPasswordErrorLabel('Password must be at least 8 symbols')
    }
  }

  const onBlurConfirmPassword = (): void => {
    if (confirmPasswordErrorLabel) {
      setConfirmPasswordErrorLabel(null)
    }

    if (confirmPassword.length && confirmPassword !== password) {
      setConfirmPasswordErrorLabel("Passwords don't match")
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
            mt={22}
          />
        </Styles.Row>
        <Styles.Form onKeyDown={onKeyDown}>
          <TextInput
            label="Enter password"
            value={password}
            onChange={setPassword}
            type="password"
            withPasswordVisible
            errorLabel={passwordErrorLabel}
            onBlurInput={onBlurPassword}
            inputRef={passwordInputRef}
          />
          <TextInput
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            type="password"
            withPasswordVisible
            errorLabel={confirmPasswordErrorLabel}
            onBlurInput={onBlurConfirmPassword}
          />
          <AgreeTerms isAgreed={isAgreed} setIsAgreed={() => setIsAgreed(!isAgreed)} mt={4} />
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
