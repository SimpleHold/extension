import * as React from 'react'
import { browser, Tabs } from 'webextension-polyfill-ts'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  text?: string
  link?: string
  openFrom?: string
  disableClose?: boolean
  icon?: string
}

const SuccessDrawer: React.FC<Props> = (props) => {
  const { isActive, onClose, text, link, openFrom, disableClose, icon } = props

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
      icon={icon || '../../assets/drawer/success.svg'}
      openFrom={openFrom}
    >
      <Styles.Row>
        {text ? <Styles.Text>{text}</Styles.Text> : null}
        {link ? <Styles.Link onClick={openLink}>{link}</Styles.Link> : null}

        {!disableClose ? (
          <Styles.Actions>
            <Button label="Ok" onClick={onClose} isSmall />
          </Styles.Actions>
        ) : null}
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default SuccessDrawer
