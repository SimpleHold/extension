import * as React from 'react'

// Components
import Button from '@components/Button'
import WalletCard from '../WalletCard'

// Styles
import Styles from './styles'

interface Props {}

const SendForm: React.FC<Props> = (props) => {
  const {} = props

  const onCancel = (): void => {}

  const onConfirm = (): void => {}

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <Styles.Container>
      <Styles.Form onSubmit={onSubmitForm}>
        <WalletCard />
        <Styles.FormRow>
          <p>FORM</p>
        </Styles.FormRow>
      </Styles.Form>
      <Styles.Actions>
        <Button label="Cancel" isLight onClick={onCancel} mr={7.5} />
        <Button label="Send" disabled onClick={onConfirm} ml={7.5} />
      </Styles.Actions>
    </Styles.Container>
  )
}

export default SendForm
