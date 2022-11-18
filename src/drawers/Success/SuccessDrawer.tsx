import * as React from 'react'
import browser from 'webextension-polyfill'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Button from '@components/Button'

// Assets
import successIcon from '@assets/drawer/success.svg'

// Styles
import Styles from './styles'

interface Props {
  isActive: boolean
  onClose: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  text?: string
  link?: string
  openFrom?: string
  disableClose?: boolean
  icon?: string
  isCloseOnLinkClick?: boolean
}

const SuccessDrawer: React.FC<Props> = (props) => {
  const { isActive, onClose, text, link, openFrom, disableClose, icon, isCloseOnLinkClick } = props

  const openLink = async (): Promise<void> => {
    await browser.tabs.create({
      url: link,
    })

    if (isCloseOnLinkClick) {
      onClose()
    }
  }

  return (
    <DrawerWrapper
      title="Success!"
      isActive={isActive}
      onClose={onClose}
      icon={icon || successIcon}
      openFrom={openFrom}
    >
      <Styles.Row>
        {text ? <Styles.Text>{text}</Styles.Text> : null}
        {link ? <Styles.Link onClick={openLink}>{link}</Styles.Link> : null}

        {!disableClose ? (
          <Styles.Actions>
            <Button label="Ok" onClick={onClose} />
          </Styles.Actions>
        ) : null}
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default SuccessDrawer
