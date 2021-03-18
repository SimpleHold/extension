import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  isActive: boolean
  title: string
  isButtonDisabled?: boolean
  onConfirm: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  textInputValue: string
  onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void
  inputLabel: string
}

const ConfirmDrawer: React.FC<Props> = (props) => {
  const {
    onClose,
    isActive,
    title,
    isButtonDisabled,
    onConfirm,
    textInputValue,
    onChangeInput,
    inputLabel,
  } = props

  return (
    <DrawerWrapper title={title} isActive={isActive} onClose={onClose}>
      <Styles.Row>
        <Styles.Form>
          <TextInput label={inputLabel} value={textInputValue} onChange={onChangeInput} />
        </Styles.Form>
        <Styles.Actions>
          <Button label="Cancel" isLight isSmall mr={7.5} onClick={onClose} />
          <Button label="Ok" disabled={isButtonDisabled} isSmall mr={7.5} onClick={onConfirm} />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default ConfirmDrawer
