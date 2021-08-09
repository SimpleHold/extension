import * as React from 'react'

// Styles
import Styles from './styles'

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  errorLabel?: string | null
  textareaRef?: React.RefObject<HTMLTextAreaElement>
}

const Textarea: React.FC<Props> = (props) => {
  const { label, value, onChange, errorLabel, textareaRef } = props

  const [isFocused, setIsFocused] = React.useState<boolean>(false)
  const fieldRef = textareaRef || React.useRef<HTMLTextAreaElement>(null)

  const onChangeTextarea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  const onClick = (): void => {
    fieldRef.current?.focus()
  }

  const onFocus = (): void => {
    setIsFocused(true)
  }

  const onBlur = (): void => {
    setIsFocused(false)
  }

  return (
    <Styles.Container
      isFocused={isFocused}
      isError={errorLabel !== undefined && errorLabel !== null && !isFocused && value.length > 0}
      onClick={onClick}
    >
      <Styles.Row isActive={isFocused || value?.length > 0}>
        <Styles.Label>
          {errorLabel && !isFocused && value.length > 0 ? errorLabel : label}
        </Styles.Label>
        <Styles.Textarea
          value={value}
          onChange={onChangeTextarea}
          ref={fieldRef}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Styles.Row>
    </Styles.Container>
  )
}

export default Textarea
