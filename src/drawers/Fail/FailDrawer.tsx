import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  isActive: boolean
  text: string
}

const FailDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, text } = props

  return (
    <DrawerWrapper
      title="Fail!"
      isActive={isActive}
      onClose={onClose}
      icon="../../assets/drawer/fail.svg"
    >
      <Styles.Row>
        <Styles.Text>{text}</Styles.Text>
        <Styles.Actions>
          <Button label="Ok" isSmall onClick={onClose} />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default FailDrawer
