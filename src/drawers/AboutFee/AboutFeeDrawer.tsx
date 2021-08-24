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
}

const AboutFeeDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive, openFrom } = props

  return (
    <DrawerWrapper
      title="What is Network Fee?"
      isActive={isActive}
      onClose={onClose}
      openFrom={openFrom}
    >
      <Styles.Row>
        <Styles.Text>
          Every time you send any cryptocurrency, from your address to another, there is a Network
          Transaction fee, and the actual fee you pay will vary according to the network. The more
          amount you pay the faster your transaction is processed.
        </Styles.Text>

        <Styles.Text>SimpleHold does not profit from it.</Styles.Text>

        <Button label="Ok" onClick={onClose} mt={30} />
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default AboutFeeDrawer
