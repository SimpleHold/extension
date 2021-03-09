import * as React from 'react'

// Components
import ModalWrapper from '@components/ModalWrapper'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  title: string
  isActive: boolean
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onConfirm: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  inputLabel: string
  inputType: string
  inputValue: string
  inputErrorLabel: null | string
  onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void
  isDisabledConfirmButton: boolean
}

const ConfirmModal: React.FC<Props> = (props) => {
  const {
    title,
    isActive,
    onClose,
    onConfirm,
    inputLabel,
    inputType,
    inputValue,
    inputErrorLabel,
    onChangeInput,
    isDisabledConfirmButton,
  } = props

  return (
    <ModalWrapper isActive={isActive} onClose={onClose} icon="../../assets/modalIcons/confirm.svg">
      <Styles.Row>
        <Styles.Title>{title}</Styles.Title>

        <Styles.Form>
          <TextInput
            label={inputLabel}
            type={inputType}
            value={inputValue}
            onChange={onChangeInput}
            errorLabel={inputErrorLabel}
          />
          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onClose} mr={7.5} isSmall />
            <Button
              label="Ok"
              disabled={isDisabledConfirmButton}
              onClick={onConfirm}
              mr={7.5}
              isSmall
            />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Row>
    </ModalWrapper>
  )
}

export default ConfirmModal
