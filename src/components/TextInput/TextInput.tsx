import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  errorLabel?: string | null
  withPasswordVisible?: boolean
  onBlurInput?: Function
  inputRef?: React.RefObject<HTMLInputElement>
  disabled?: boolean
}

const TextInput: React.FC<Props> = (props) => {
  const {
    label,
    value,
    onChange,
    type,
    errorLabel,
    withPasswordVisible,
    onBlurInput,
    inputRef,
    disabled,
  } = props

  const textInputRef = inputRef || React.useRef<HTMLInputElement>(null)
  const visibleBlockRef = React.useRef<HTMLDivElement>(null)
  let numberInputRef: HTMLInputElement

  const [isFocused, setIsFocused] = React.useState<boolean>(false)
  const [isPasswordVisible, setPasswordVisible] = React.useState<boolean>(false)

  const onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (
      (!disabled &&
        visibleBlockRef.current &&
        !visibleBlockRef.current.contains(event.target as Node)) ||
      !withPasswordVisible
    ) {
      if (type === 'number') {
        numberInputRef.focus()
      } else {
        textInputRef.current?.focus()
      }
    }
  }

  const onFocus = (): void => {
    setIsFocused(true)
  }

  const onBlur = (): void => {
    setIsFocused(false)
    if (onBlurInput) {
      onBlurInput()
    }
  }

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  const renderInput = () => {
    if (type === 'number') {
      return (
        <Styles.NumberInput
          getInputRef={(el: HTMLInputElement) => (numberInputRef = el)}
          onFocus={onFocus}
          onBlur={onBlur}
          value={value}
          onChange={onChangeInput}
          decimalScale={8}
          disabled={disabled}
        />
      )
    }
    return (
      <Styles.Input
        ref={textInputRef}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        onChange={onChangeInput}
        type={type === 'password' && isPasswordVisible ? 'text' : type}
        disabled={disabled}
      />
    )
  }

  return (
    <Styles.Container
      onClick={onClick}
      isFocused={isFocused}
      isError={errorLabel !== undefined && errorLabel !== null && !isFocused && value.length > 0}
      disabled={disabled}
    >
      <Styles.Row isActive={isFocused || value?.length > 0}>
        <Styles.Label>
          {errorLabel && !isFocused && value.length > 0 ? errorLabel : label}
        </Styles.Label>
        {renderInput()}
      </Styles.Row>
      {withPasswordVisible ? (
        <Styles.VisibleInput
          ref={visibleBlockRef}
          onClick={() => setPasswordVisible(!isPasswordVisible)}
        >
          <Styles.EyeIcon isVisible={isPasswordVisible} />
        </Styles.VisibleInput>
      ) : null}
    </Styles.Container>
  )
}

export default TextInput
