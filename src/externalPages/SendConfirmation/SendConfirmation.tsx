import * as React from 'react'
import { render } from 'react-dom'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Styles
import Styles from './styles'

const SendConfirmation: React.FC = () => {
  const onClose = (): void => {
    window.close()
  }

  return (
    <ExternalPageContainer
      onClose={onClose}
      headerStyle="green"
      backPageTitle="Send"
      backPageUrl="send.html"
    >
      <Styles.Body>
        <p>SendConfirmation</p>
      </Styles.Body>
    </ExternalPageContainer>
  )
}

render(<SendConfirmation />, document.getElementById('send-confirmation'))
