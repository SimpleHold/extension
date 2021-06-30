import * as React from 'react'
import { render } from 'react-dom'

// Components
import CheckBox from '@components/CheckBox'

// Utils
import { removeItem, getItem } from '@utils/storage'
import { getUrl, getTabs, removeTabs } from '@utils/extension'
import { openWebPage } from '@utils/extension'

// Styles
import Styles from './styles'

const Phishing: React.FC = () => {
  const [isAgreedVisible, setAgreedVisible] = React.useState<boolean>(false)
  const [isAgreed, setIsAgreed] = React.useState<boolean>(false)
  const [rightUrl, setRightUrl] = React.useState<string | null>(null)
  const [rightSiteName, setRightSiteName] = React.useState<string | null>(null)

  React.useEffect(() => {
    closePhishingSite()
    getRightSite()
  }, [])

  const getRightSite = (): void => {
    setRightUrl('https://www.myetherwallet.com/')
    setRightSiteName('SimpleSwap')
  }

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

  const onVisit = async (siteUrl: null | string): Promise<void> => {
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

  const onClickButton = (): void => {
    if (!isAgreedVisible) {
      setAgreedVisible(true)
    } else {
      if (isAgreed) {
        const siteUrl = getItem('phishingSite')

        onVisit(siteUrl)
      }
    }
  }

  const toggleAgreed = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.stopPropagation()

    setIsAgreed((prevValue: boolean) => !prevValue)
  }

  const onVisitRightSite = (): void => {
    if (rightUrl) {
      onVisit(rightUrl)
    }
  }

  return (
    <Styles.Wrapper>
      <Styles.Logo />

      <Styles.Warning>
        <Styles.WarningRow>
          <Styles.Image />
          <Styles.Title>Be careful</Styles.Title>
          {rightSiteName ? (
            <Styles.Description>
              It looks like the website you're going to visit is not what it seems to be. This page
              is marked as a phishing scam by our partners {rightSiteName}. Tap this button to find
              the original SimpleHold you're looking for.
            </Styles.Description>
          ) : null}

          {rightUrl ? (
            <Styles.RightSiteBlock onClick={onVisitRightSite}>
              <Styles.RightSiteIconRow>
                <Styles.RightBlockIcon />
              </Styles.RightSiteIconRow>
              <Styles.RightSiteBlockRow>
                <Styles.RightSiteBlockTitle>Go to right site:</Styles.RightSiteBlockTitle>
                <Styles.RightSiteUrl>{rightUrl}</Styles.RightSiteUrl>
              </Styles.RightSiteBlockRow>
            </Styles.RightSiteBlock>
          ) : null}
        </Styles.WarningRow>
        <Styles.WarningFooter>
          <Styles.AdvancedRow>
            <Styles.AgreedBlock isVisible={isAgreedVisible} onClick={toggleAgreed}>
              {isAgreedVisible ? (
                <>
                  <CheckBox value={isAgreed} onClick={toggleAgreed} color="#31A76C" />
                  <Styles.AgreedText>
                    I understand all risks about phishing sites and want to go on
                  </Styles.AgreedText>
                </>
              ) : null}
            </Styles.AgreedBlock>
            <Styles.AdvancedButton
              isVisible={isAgreedVisible}
              isAgreed={isAgreed}
              onClick={onClickButton}
            >
              <Styles.AdvancedButtonTitle>
                {isAgreedVisible ? 'Continue' : 'Advanced'}
              </Styles.AdvancedButtonTitle>
            </Styles.AdvancedButton>
          </Styles.AdvancedRow>
        </Styles.WarningFooter>
      </Styles.Warning>
    </Styles.Wrapper>
  )
}

render(<Phishing />, document.getElementById('phishing'))
