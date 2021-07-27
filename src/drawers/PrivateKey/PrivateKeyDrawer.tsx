import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import CopyToClipboard from '@components/CopyToClipboard'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  isActive: boolean
  privateKey: string | null
  isMnemonic?: boolean
}

const PrivateKeyDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, privateKey, isMnemonic } = props

  return (
    <DrawerWrapper
      title={isMnemonic ? 'Recovery phrase' : 'Private key'}
      isActive={isActive}
      onClose={onClose}
    >
      <Styles.Row>
        {privateKey ? (
          <CopyToClipboard value={privateKey}>
            <Styles.PrivateKey>{privateKey}</Styles.PrivateKey>
          </CopyToClipboard>
        ) : null}
        <Styles.Actions>
          <Button label="Done" onClick={onClose} />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default PrivateKeyDrawer
