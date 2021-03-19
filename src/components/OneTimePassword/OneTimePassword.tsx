import * as React from 'react'
import OtpInput from 'react-otp-input'

// Styles
import Styles from './styles'

interface Props {
  value: string
  onChange: (value: string) => void
  isError?: boolean
}

const OneTimePassword: React.FC<Props> = (props) => {
  const { value, onChange, isError } = props

  const otpInputRef = React.useRef<OtpInput>(null)

  React.useEffect(() => {
    if (isError) {
      document.querySelector<HTMLInputElement>('[aria-label="Digit 6"]')?.blur()
    }
  }, [isError])

  return (
    <Styles.Container isError={isError}>
      <OtpInput
        value={value}
        onChange={onChange}
        numInputs={6}
        isInputNum
        shouldAutoFocus
        ref={otpInputRef}
      />
    </Styles.Container>
  )
}

export default OneTimePassword
