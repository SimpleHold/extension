import * as React from 'react'
import { render } from 'react-dom'

// Components
import CheckBox from '@components/CheckBox'

// Utils
import { getItem, getJSON, removeItem, setItem } from '@utils/storage'
import { getUrl, getTabs, removeTabs } from '@utils/extension'
import { openWebPage } from '@utils/extension'
import { TPhishingSite } from '@utils/api/types'

// Styles
import Styles from './styles'

const Phishing: React.FC = () => {
  const [isAgreedVisible, setAgreedVisible] = React.useState<boolean>(false)
  const [isAgreed, setIsAgreed] = React.useState<boolean>(false)
  const [phishingSite, setPhishingSite] = React.useState<TPhishingSite | null>(null)

  React.useEffect(() => {
    getInfo()
  }, [])

  React.useEffect(() => {
    if (phishingSite) {
      closePhishingSite()
    }
  }, [phishingSite])

  const getInfo = (): void => {
    const data = getJSON('phishingSite')

    if (data) {
      setPhishingSite(data)
    }
  }

  const closePhishingSite = async (): Promise<void> => {
    if (phishingSite) {
      const tabs = await getTabs({
        active: false,
        url: [phishingSite.url, getUrl('phishing.html')],
      })

      const mapTabIds = tabs.map((tab) => tab.id)

      if (mapTabIds.length) {
        // @ts-ignore
        await removeTabs(mapTabIds)
      }
    }
  }

  const onVisit = async (siteUrl: null | string): Promise<void> => {
    if (siteUrl) {
      const tab = await getTabs({
        active: true,
        url: getUrl('phishing.html'),
      })

      if (siteUrl === phishingSite?.url) {
        const data = getJSON('phishingSites')

        if (data) {
          const siteIndex = data.findIndex((i: TPhishingSite) => i.url === siteUrl)

          if (siteIndex !== -1) {
            data[siteIndex].latestVisit = new Date().getTime()
            setItem('phishingSites', JSON.stringify(data))

            const url = getItem('phishingSiteUrl')

            if (url) {
              openWebPage(url)
              removeItem('phishingSiteUrl')
            }
          }
        }
      } else {
        openWebPage(siteUrl)
      }

      if (tab[0]?.id) {
        await removeTabs(tab[0].id)
      }
    }
  }

  const onClickButton = (): void => {
    if (!isAgreedVisible) {
      setAgreedVisible(true)
    } else {
      if (isAgreed && phishingSite) {
        onVisit(phishingSite.url)
      }
    }
  }

  const toggleAgreed = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.stopPropagation()

    setIsAgreed((prevValue: boolean) => !prevValue)
  }

  const onVisitRightSite = (): void => {
    if (phishingSite) {
      onVisit(phishingSite.rightUrl)
    }
  }

  if (!getItem('phishingSite')) {
    return null
  }

  return (
    <Styles.Wrapper>
      <Styles.Logo />

      <Styles.Warning>
        <Styles.WarningRow>
          <Styles.Image />
          <Styles.Title>Be careful</Styles.Title>
          {phishingSite ? (
            <Styles.Description>
              It looks like the website you're going to visit is not what it seems to be. This page
              is marked as a phishing scam by our partners {phishingSite.name}. Tap this button to
              find the original SimpleHold you're looking for.
            </Styles.Description>
          ) : null}

          {phishingSite ? (
            <Styles.RightSiteBlock onClick={onVisitRightSite}>
              <Styles.RightSiteIconRow>
                <Styles.RightBlockIcon />
              </Styles.RightSiteIconRow>
              <Styles.RightSiteBlockRow>
                <Styles.RightSiteBlockTitle>Go to right site:</Styles.RightSiteBlockTitle>
                <Styles.RightSiteUrl>{phishingSite.rightUrl}</Styles.RightSiteUrl>
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
