import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import Button from '@components/Button'

// Utils
import { logEvent } from '@utils/amplitude'

// Config
import { ANALYTICS_OK } from '@config/events'

// Styles
import Styles from './styles'

const AnalyticsData: React.FC = () => {
  const history = useHistory()

  const onNext = (): void => {
    localStorage.setItem('analytics', 'agreed')

    logEvent({
      name: ANALYTICS_OK,
    })

    history.push('/welcome')
  }

  return (
    <Styles.Wrapper>
      <Header noActions logoColor="#3FBB7D" withBorder />
      <Styles.Container>
        <Styles.Title>Analytics data</Styles.Title>
        <Styles.Description>
          We work hard to provide you with the best experience when using our extension. To do it
          more effectively we would like to gather anonymized usage data. This data will help us
          better understand how our customers interact with our wallet.
        </Styles.Description>
        <Styles.FeaturesBlock>
          <Styles.FeaturesTitle>Please, keep in mind that</Styles.FeaturesTitle>
          <Styles.FeaturesList>
            <Styles.Feature>
              <Styles.FeatureLine />
              <Styles.FeatureIcon />
              <Styles.Features>
                <Styles.FeatureText>We will track your clicks and pageviews</Styles.FeatureText>
                <Styles.FeatureText>
                  You can reject the data collection at any time via Settings
                </Styles.FeatureText>
                <Styles.FeatureText>
                  We guarantee that your data is not for selling
                </Styles.FeatureText>
              </Styles.Features>
            </Styles.Feature>
            <Styles.Feature>
              <Styles.FeatureLine />
              <Styles.FeatureIcon />
              <Styles.Features>
                <Styles.FeatureText>
                  SimpleHold will never collect any personal information such as keys, addresses,
                  transactions, balances or hashes
                </Styles.FeatureText>
                <Styles.FeatureText>We won’t collect your full IP address</Styles.FeatureText>
              </Styles.Features>
            </Styles.Feature>
          </Styles.FeaturesList>
        </Styles.FeaturesBlock>
        <Styles.Actions>
          <Button label="I got it" onClick={onNext} isLight />
        </Styles.Actions>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default AnalyticsData
