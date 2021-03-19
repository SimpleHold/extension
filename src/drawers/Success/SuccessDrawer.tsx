import * as React from 'react'
import { browser, Tabs } from 'webextension-polyfill-ts'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  text?: string
  link?: string
}

const SuccessDrawer: React.FC<Props> = (props) => {
  const { isActive, onClose, text, link } = props

  const openLink = (): Promise<Tabs.Tab> => {
    return browser.tabs.create({
      url: link,
    })
  }

  return (
    <DrawerWrapper
      title="Success!"
      isActive={isActive}
      onClose={onClose}
      icon="../../assets/drawer/success.svg"
    >
      <Styles.Row>
        {text ? <Styles.Text>{text}</Styles.Text> : null}
        {link ? <Styles.Link onClick={openLink}>{link}</Styles.Link> : null}

        <Styles.Actions>
          <Button label="Ok" onClick={onClose} isSmall />
        </Styles.Actions>
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default SuccessDrawer
