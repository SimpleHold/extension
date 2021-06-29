import * as React from 'react'
import { render } from 'react-dom'
import { browser } from 'webextension-polyfill-ts'

// Styles
import Styles from './styles'

const Phishing: React.FC = () => {
  React.useEffect(() => {
    closePhishingSite()
  }, [])

  const closePhishingSite = async (): Promise<void> => {
    const urls = localStorage.getItem('phishingUrls')

    if (urls) {
      const tabs = await browser.tabs.query({
        active: false,
        url: JSON.parse(urls),
      })

      const mapTabIds = tabs.map((tab) => tab.id)

      if (mapTabIds.length) {
        // @ts-ignore
        await browser.tabs.remove(mapTabIds)
      }
    }
  }

  return (
    <Styles.Wrapper>
      <p>Phishing</p>
    </Styles.Wrapper>
  )
}

render(<Phishing />, document.getElementById('phishing'))
