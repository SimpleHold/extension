import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  isActive: boolean
  onConfirm: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const LogoutDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, onConfirm } = props

  return (
    <DrawerWrapper title="Confirm log out" isActive={isActive} onClose={onClose}>
      <Styles.Row>
        <Styles.Text>
          Are you sure that you want to clear cache and log out? Note: the backup file will be
          downloaded after you confirm this action.
        </Styles.Text>

        <Styles.Actions>
          <Button label="Cancel" isLight onClick={onClose} mr={7.5} />
          <Button label="Log out" onClick={onConfirm} ml={7.5} />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default LogoutDrawer
