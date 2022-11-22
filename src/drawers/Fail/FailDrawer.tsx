import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

// Assets
import failIcon from '@assets/drawer/fail.svg'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  isActive: boolean
  text: string
  openFrom?: string
}

const FailDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, text, openFrom } = props

  return (
    <DrawerWrapper
      title="Fail!"
      isActive={isActive}
      onClose={onClose}
      icon={failIcon}
      openFrom={openFrom}
    >
      <Styles.Row>
        <Styles.Text>{text}</Styles.Text>
        <Styles.Actions>
          <Button label="Ok" onClick={onClose} />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default FailDrawer
