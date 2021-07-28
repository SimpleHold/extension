import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  isActive: boolean
  openFrom?: string
  title: string
  text?: string
  icon?: string
  button?: {
    label: string
    onClick: () => void
  }
}

const BasicDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, openFrom, title, text, icon, button } = props

  return (
    <DrawerWrapper
      title={title}
      isActive={isActive}
      onClose={onClose}
      icon={icon}
      openFrom={openFrom}
    >
      <Styles.Row>
        {text ? <Styles.Text>{text}</Styles.Text> : null}

        {button ? <Button label={button.label} onClick={button.onClick} mt={30} /> : null}
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default BasicDrawer
