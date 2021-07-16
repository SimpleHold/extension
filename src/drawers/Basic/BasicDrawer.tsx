import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  isActive: boolean
  text?: string
  openFrom?: string
  icon?: string
  title: string
  buttonLabel?: string
  buttonOnClick?: () => void
}

const BasicDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, text, openFrom, icon, title, buttonLabel, buttonOnClick } = props

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

        {buttonLabel && buttonOnClick ? (
          <Button label={buttonLabel} onClick={buttonOnClick} mt={30} />
        ) : null}
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default BasicDrawer
