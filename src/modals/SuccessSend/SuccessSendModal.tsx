import * as React from 'react'
import { browser, Tabs } from 'webextension-polyfill-ts'

// Components
import ModalWrapper from '@components/ModalWrapper'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  transactionHash: undefined | string
}

const SuccessSendModal: React.FC<Props> = (props) => {
  const { isActive, onClose, transactionHash } = props

  const blockchairLink = `https://blockchair.com/bitcoin/transaction/${transactionHash}`

  const viewTransaction = (): Promise<Tabs.Tab> => {
    return browser.tabs.create({
      url: blockchairLink,
    })
  }

  return (
    <ModalWrapper isActive={isActive} onClose={onClose} icon="../../assets/modalIcons/success.svg">
      <Styles.Row>
        <Styles.Title>Success!</Styles.Title>
        <Styles.Text>Your transaction has successfully sent. You can check it here:</Styles.Text>
        {transactionHash ? (
          <Styles.BlockchairLink onClick={viewTransaction}>{blockchairLink}</Styles.BlockchairLink>
        ) : null}
      </Styles.Row>
    </ModalWrapper>
  )
}

export default SuccessSendModal
