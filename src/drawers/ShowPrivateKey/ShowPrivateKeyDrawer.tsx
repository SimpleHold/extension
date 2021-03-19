import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import CopyToClipboard from '@components/CopyToClipboard'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  isActive: boolean
  privateKey: string | null
}

const ShowPrivateKeyDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, privateKey } = props

  return (
    <DrawerWrapper title="Show private key" isActive={isActive} onClose={onClose}>
      <Styles.Row>
        {privateKey ? (
          <CopyToClipboard value={privateKey}>
            <Styles.PrivateKey>{privateKey}</Styles.PrivateKey>
          </CopyToClipboard>
        ) : null}
        <Styles.Actions>
          <Button label="Done" onClick={onClose} isSmall />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default ShowPrivateKeyDrawer
