import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  isActive: boolean
  onRename: (walletName: string) => () => void
}

const RenameWalletDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, onRename } = props

  const [name, setName] = React.useState<string>('')
  const textInputRef = React.useRef<HTMLInputElement>(null)

  const errorLabel = name.length > 20 ? 'Should be less than 20 characters' : null

  React.useEffect(() => {
    if (isActive) {
      setTimeout(() => {
        textInputRef.current?.focus()
      }, 100)

      if (name.length) {
        setName('')
      }
    }
  }, [isActive])

  return (
    <DrawerWrapper title="Rename wallet" isActive={isActive} onClose={onClose} withCloseIcon>
      <Styles.Row>
        <TextInput
          label="Write new wallet name"
          value={name}
          onChange={setName}
          inputRef={textInputRef}
          errorLabel={errorLabel}
        />
        <Button
          mt={15}
          label="Apply"
          onClick={onRename(name)}
          disabled={name.length === 0 || errorLabel !== null}
        />
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default RenameWalletDrawer
