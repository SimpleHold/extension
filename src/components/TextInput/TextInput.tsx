import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import Tooltip from '@components/Tooltip'

// Styles
import Styles from './styles'

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  type: 'text' | 'password' | 'number'
  errorLabel?: string | null
  onBlurInput?: Function
  inputRef?: React.RefObject<HTMLInputElement>
  disabled?: boolean
  openFrom?: string
  renderButton?: {
    label: string
    onClick: () => void
  }
  labelTooltip?: string
}

const TextInput: React.FC<Props> = (props) => {
  const {
    label,
    value,
    onChange,
    type,
    errorLabel,
    onBlurInput,
    inputRef,
    disabled,
    openFrom,
    renderButton,
    labelTooltip,
  } = props

  const textInputRef = inputRef || React.useRef<HTMLInputElement>(null)
  const visibleBlockRef = React.useRef<HTMLDivElement>(null)
  let numberInputRef: HTMLInputElement

  const [isFocused, setIsFocused] = React.useState<boolean>(false)
  const [isPasswordVisible, setPasswordVisible] = React.useState<boolean>(false)
  const [isButtonVisible, setButtonVisible] = React.useState<boolean>(false)
  const [isClearButtonVisible, setClearButtonVisible] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (!isFocused && isButtonVisible) {
      setTimeout(() => {
        setButtonVisible(false)
      }, 150)
    }
  }, [isFocused, isButtonVisible])

  React.useEffect(() => {
    if (!isFocused && isClearButtonVisible) {
      setTimeout(() => {
        setClearButtonVisible(false)
      }, 150)
    }
  }, [isFocused, isClearButtonVisible])

  React.useEffect(() => {
    if (value.length && !isClearButtonVisible && isFocused) {
      setClearButtonVisible(true)
    }
  }, [value, isClearButtonVisible, isFocused])

  const onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (
      (!disabled &&
        visibleBlockRef.current &&
        !visibleBlockRef.current.contains(event.target as Node)) ||
      type !== 'password'
    ) {
      if (type === 'number') {
        numberInputRef.focus()
      } else {
        textInputRef.current?.focus()
      }
    }
  }

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  const onClear = (): void => {
    setIsFocused(false)
    onChange('')
    textInputRef.current?.focus()
    setClearButtonVisible(true)
  }

  const onClickButton = (): void => {
    setIsFocused(false)

    if (renderButton) {
      renderButton.onClick()
      textInputRef.current?.focus()
    }
  }

  const onFocus = (): void => {
    setIsFocused(true)
    setClearButtonVisible(true)

    if (renderButton) {
      setButtonVisible(true)
    }
  }

  const onBlur = () => {
    setIsFocused(false)

    if (onBlurInput) {
      onBlurInput()
    }
  }

  const toggleVisible = (): void => {
    setPasswordVisible((prev: boolean) => !prev)
  }

  return (
    <Styles.Container
      onClick={onClick}
      isFocused={isFocused}
      isError={errorLabel !== undefined && errorLabel !== null && !isFocused && value.length > 0}
      disabled={disabled}
      pr={isClearButtonVisible || type === 'password' ? 10 : 16}
    >
      <Styles.Row isActive={isFocused || value?.length > 0} openFrom={openFrom}>
        <Styles.LabelRow>
          <Styles.Label>
            {errorLabel && !isFocused && value.length > 0 ? errorLabel : label}
          </Styles.Label>
          {labelTooltip?.length && errorLabel && value.length && !isFocused ? (
            <Tooltip text={labelTooltip} maxWidth={195} textSpace="pre-wrap" mt={5}>
              <SVG src="../../assets/icons/warning.svg" width={12} height={12} />
            </Tooltip>
          ) : null}
        </Styles.LabelRow>
        {type === 'number' ? (
          <Styles.NumberInput
            getInputRef={(el: HTMLInputElement) => (numberInputRef = el)}
            onFocus={onFocus}
            onBlur={onBlur}
            value={value}
            onChange={onChangeInput}
            decimalScale={8}
            disabled={disabled}
          />
        ) : (
          <Styles.Input
            ref={textInputRef}
            onFocus={onFocus}
            onBlur={onBlur}
            value={value}
            onChange={onChangeInput}
            type={type === 'password' && isPasswordVisible ? 'text' : type}
            disabled={disabled}
          />
        )}
      </Styles.Row>

      {type === 'password' ? (
        <Styles.VisibleInput ref={visibleBlockRef} onClick={toggleVisible}>
          <Styles.EyeIcon isVisible={isPasswordVisible} />
        </Styles.VisibleInput>
      ) : null}

      {value.length && type !== 'password' && isClearButtonVisible ? (
        <Styles.ClearButton onClick={onClear}>
          <SVG src="../../assets/icons/times.svg" width={10} height={10} />
        </Styles.ClearButton>
      ) : null}

      {renderButton && !value.length && isButtonVisible ? (
        <Styles.Button onClick={onClickButton}>
          <Styles.ButtonLabel>{renderButton.label}</Styles.ButtonLabel>
        </Styles.Button>
      ) : null}
    </Styles.Container>
  )
}

export default TextInput
