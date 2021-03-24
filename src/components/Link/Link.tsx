import * as React from 'react'
import SVG from 'react-inlinesvg'
import { browser, Tabs } from 'webextension-polyfill-ts'

// Styles
import Styles from './styles'

interface Props {
  to: string
  title: string
  mt?: number
}

const Link: React.FC<Props> = (props) => {
  const { to, title, mt = 0 } = props

  const openWebPage = (): Promise<Tabs.Tab> => {
    return browser.tabs.create({ url: to })
  }

  return (
    <Styles.Container onClick={openWebPage} mt={mt}>
      <Styles.IconRow>
        <SVG src="../../assets/icons/ask.svg" width={15} height={15} title="ask" />
      </Styles.IconRow>
      <Styles.Title>{title}</Styles.Title>
    </Styles.Container>
  )
}

export default Link
