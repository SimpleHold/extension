import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  isActive: boolean
  openFrom?: string
}

const AboutFeeDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, openFrom } = props

  return (
    <DrawerWrapper
      title="What is Network Fee"
      isActive={isActive}
      onClose={onClose}
      openFrom={openFrom}
    >
      <Styles.Row>
        <Styles.Text>I don't know</Styles.Text>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default AboutFeeDrawer
