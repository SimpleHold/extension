import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import Button from '@components/Button'

// Styles
import Styles from './styles'

const AnalyticsData: React.FC = () => {
  const history = useHistory()

  const onNext = (): void => {
    localStorage.setItem('analytics', 'agreed')
    history.push('/welcome')
  }

  return (
    <Styles.Wrapper>
      <Header noActions logoColor="#3FBB7D" withBorder />
      <Styles.Container>
        <Styles.Title>Analytics data</Styles.Title>
        <Styles.Description>
          We work hard to provide you best experience with our application. To do it more
          effectively we would like to gather anonymized usage data. This data will help us better
          understand how our users interact with our application.
        </Styles.Description>
        <Styles.FeaturesBlock>
          <Styles.FeaturesTitle>SimpleHold will</Styles.FeaturesTitle>
          <Styles.FeaturesList>
            <Styles.Feature>
              <Styles.FeatureLine />
              <Styles.FeatureIcon />
              <Styles.Features>
                <Styles.FeatureText>Always allow you to opt-out via Settings</Styles.FeatureText>
                <Styles.FeatureText>Send anonymized click & pageview events</Styles.FeatureText>
              </Styles.Features>
            </Styles.Feature>
            <Styles.Feature>
              <Styles.FeatureLine />
              <Styles.FeatureIcon />
              <Styles.Features>
                <Styles.FeatureText>
                  Never collect keys, addresses, transactions, balances, hashes, or any personal
                  information
                </Styles.FeatureText>
                <Styles.FeatureText>Never collect your full IP address</Styles.FeatureText>
                <Styles.FeatureText>Never sell data for profit. Ever!</Styles.FeatureText>
              </Styles.Features>
            </Styles.Feature>
          </Styles.FeaturesList>
        </Styles.FeaturesBlock>
        <Styles.Actions>
          <Button label="I got it" onClick={onNext} />
        </Styles.Actions>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default AnalyticsData
