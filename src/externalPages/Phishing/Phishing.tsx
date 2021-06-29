import * as React from 'react'
import { render } from 'react-dom'

// Utils
import { removeItem } from '@utils/storage'
import { getUrl, getTabs, removeTabs } from '@utils/extension'

// Styles
import Styles from './styles'

const Phishing: React.FC = () => {
  React.useEffect(() => {
    closePhishingSite()
  }, [])

  const closePhishingSite = async (): Promise<void> => {
    const urls = localStorage.getItem('phishingUrls')

    if (urls) {
      const tabs = await getTabs({
        active: false,
        url: [...JSON.parse(urls), getUrl('phishing.html')],
      })

      const mapTabIds = tabs.map((tab) => tab.id)

      if (mapTabIds.length) {
        // @ts-ignore
        await removeTabs(mapTabIds)
      }
    }

    removeItem('latestPhishingSite')
  }

  return (
    <Styles.Wrapper>
      <p>Phishing</p>
    </Styles.Wrapper>
  )
}

render(<Phishing />, document.getElementById('phishing'))
