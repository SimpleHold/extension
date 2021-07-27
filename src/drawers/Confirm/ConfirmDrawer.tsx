import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  isActive: boolean
  title: string
  isButtonDisabled?: boolean
  onConfirm: () => void
  textInputValue: string
  onChangeText: (data: string) => void
  inputLabel: string
  textInputType?: string
  inputErrorLabel?: string | null
  openFrom?: string
  isButtonLoading?: boolean
}

const ConfirmDrawer: React.FC<Props> = (props) => {
  const {
    onClose,
    isActive,
    title,
    isButtonDisabled,
    onConfirm,
    textInputValue,
    onChangeText,
    inputLabel,
    textInputType,
    inputErrorLabel,
    openFrom,
    isButtonLoading,
  } = props

  const textInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isActive) {
      if (textInputValue.length) {
        onChangeText('')
      }

      setTimeout(() => {
        textInputRef.current?.focus()
      }, 20)
    }
  }, [isActive])

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isButtonDisabled) {
      onConfirm()
    }
  }

  return (
    <DrawerWrapper title={title} isActive={isActive} onClose={onClose} openFrom={openFrom}>
      <Styles.Row>
        <Styles.Form onSubmit={onSubmitForm}>
          <TextInput
            label={inputLabel}
            value={textInputValue}
            onChange={onChangeText}
            type={textInputType}
            errorLabel={inputErrorLabel}
            inputRef={textInputRef}
            openFrom={openFrom}
          />
        </Styles.Form>
        <Styles.Actions>
          <Button label="Cancel" isLight mr={7.5} onClick={onClose} />
          <Button
            label="Ok"
            disabled={isButtonDisabled}
            mr={7.5}
            onClick={onConfirm}
            isLoading={isButtonLoading}
          />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default ConfirmDrawer
