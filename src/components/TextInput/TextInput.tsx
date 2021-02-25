import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  label: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  minLength?: number
  maxLength?: number
  withError?: boolean
  errorLabel?: string
}

const TextInput: React.FC<Props> = (props) => {
  const {
    label,
    value,
    onChange,
    type = 'text',
    minLength,
    maxLength,
    withError,
    errorLabel,
  } = props

  const [isFocused, setIsFocused] = React.useState<boolean>(false)
  const textInputRef = React.useRef<HTMLInputElement>(null)

  const onClick = (): void => {
    setIsFocused(true)
    setTimeout(() => {
      textInputRef.current?.focus()
    }, 100)
  }

  const onBlur = (): void => {
    setIsFocused(false)
  }

  return (
    <Styles.Container onClick={onClick} isFocused={isFocused}>
      <Styles.Label isError={!isFocused && withError}>
        {!isFocused && errorLabel && withError ? errorLabel : label}
      </Styles.Label>
      {value || isFocused ? (
        <Styles.TextInput
          value={value}
          onChange={onChange}
          ref={textInputRef}
          onBlur={onBlur}
          type={type}
          minLength={minLength}
          maxLength={maxLength}
        />
      ) : null}
    </Styles.Container>
  )
}

export default TextInput
