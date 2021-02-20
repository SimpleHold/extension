import * as React from 'react'

// Components
import Header from '@components/Header'
import Button from '@components/Button'

// Styles
import Styles from './styles'

const UsageData: React.FC = () => {
  return (
    <Styles.Wrapper>
      <Header noActions />
      <Styles.Container>
        <Styles.Title>Help Us Improve SimpleHold</Styles.Title>
        <Styles.Description>
          SimpleHold would like to gather usage data to better understand how our users interact
          with the extension. This data will be used to continually improve the usability.
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
          <Button label="No, thanks" />
          <Button label="I agree" />
        </Styles.Actions>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default UsageData
