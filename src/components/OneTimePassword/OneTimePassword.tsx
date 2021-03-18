import * as React from 'react'
import OtpInput from 'react-otp-input'

// Styles
import Styles from './styles'

interface Props {
  value: string
  onChange: (value: string) => void
  isError: boolean
}

const OneTimePassword: React.FC<Props> = (props) => {
  const { value, onChange, isError } = props

  return (
    <Styles.Container isError={isError}>
      <OtpInput value={value} onChange={onChange} numInputs={6} isInputNum shouldAutoFocus />
    </Styles.Container>
  )
}

export default OneTimePassword
