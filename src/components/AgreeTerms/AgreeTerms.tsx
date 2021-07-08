import * as React from 'react'
import { browser, Tabs } from 'webextension-polyfill-ts'

// Components
import CheckBox from '@components/CheckBox'

// Styles
import Styles from './styles'

interface Props {
  isAgreed: boolean
  setIsAgreed: () => void
  mt?: number
}

const AgreeTerms: React.FC<Props> = (props) => {
  const { isAgreed, setIsAgreed, mt } = props

  const openTerms = (): Promise<Tabs.Tab> => {
    return browser.tabs.create({ url: 'https://simplehold.io/terms' })
  }

  return (
    <Styles.Container onClick={setIsAgreed} mt={mt}>
      <CheckBox value={isAgreed} onClick={setIsAgreed} />
      <Styles.Text>
        I have read and agreed with the{' '}
        <Styles.TermsLink onClick={openTerms}>Terms of Use</Styles.TermsLink>
      </Styles.Text>
    </Styles.Container>
  )
}

export default AgreeTerms
