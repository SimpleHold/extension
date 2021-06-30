import * as React from 'react'
import { render } from 'react-dom'

// Utils
import { removeItem, getItem } from '@utils/storage'
import { getUrl, getTabs, removeTabs } from '@utils/extension'
import { openWebPage } from '@utils/extension'

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

  const onVisit = async (): Promise<void> => {
    const siteUrl = getItem('phishingSite')

    if (siteUrl) {
      const tab = await getTabs({
        active: true,
        url: getUrl('phishing.html'),
      })

      openWebPage(siteUrl)

      if (tab[0]?.id) {
        await removeTabs(tab[0].id)
      }
    }
  }

  return (
    <Styles.Wrapper>
      <Styles.Logo />

      <Styles.Warning>
        <Styles.WarningRow>
          <Styles.Image />
          <Styles.Title>Be careful</Styles.Title>
          <Styles.Description>
            It looks like the website you're going to visit is not what it seems to be. This page is
            marked as a phishing scam by our partners SimpleSwap. Tap this button to find the
            original SimpleHold you're looking for.
          </Styles.Description>
        </Styles.WarningRow>
        <Styles.WarningFooter>
          <Styles.AdvancedButton>
            <Styles.AdvancedButtonTitle>Advanced</Styles.AdvancedButtonTitle>
          </Styles.AdvancedButton>
        </Styles.WarningFooter>
      </Styles.Warning>
    </Styles.Wrapper>
  )
}

render(<Phishing />, document.getElementById('phishing'))
