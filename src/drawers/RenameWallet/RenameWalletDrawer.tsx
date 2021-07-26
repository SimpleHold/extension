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

  return (
    <DrawerWrapper title="Rename wallet" isActive={isActive} onClose={onClose}>
      <Styles.Row>
        <TextInput label="Write new wallet name" value={name} onChange={setName} />
        <Button mt={15} label="Apply" onClick={onRename(name)} disabled={!name.length} isSmall />
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default RenameWalletDrawer
