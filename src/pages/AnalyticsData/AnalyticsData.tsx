import * as React from 'react'
import { useHistory } from 'react-router-dom'
import SVG from 'react-inlinesvg'

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

        <Styles.ListTitle>Please, keep in mind that</Styles.ListTitle>

        <Styles.ListRow color="#3FBB7D">
          <Styles.ListDivider>
            <Styles.ListIconRow color="#3FBB7D">
              <SVG src="../../assets/icons/check.svg" width={9} height={9} title="check" />
            </Styles.ListIconRow>
          </Styles.ListDivider>
          <Styles.List>
            <Styles.ListItem>We will track your clicks and pageviews</Styles.ListItem>
            <Styles.ListItem>
              You can reject the data collection at any time via Settings
            </Styles.ListItem>
            <Styles.ListItem>We guarantee that your data is not for selling</Styles.ListItem>
          </Styles.List>
        </Styles.ListRow>

        <Styles.ListRow color="#EB5757">
          <Styles.ListDivider>
            <Styles.ListIconRow color="#EB5757">
              <SVG src="../../assets/icons/times.svg" width={9} height={9} title="times" />
            </Styles.ListIconRow>
          </Styles.ListDivider>
          <Styles.List>
            <Styles.ListItem>
              SimpleHold will never collect any personal information such as keys, addresses,
              transactions, balances or hashes
            </Styles.ListItem>
            <Styles.ListItem>We won’t collect your full IP address</Styles.ListItem>
          </Styles.List>
        </Styles.ListRow>

        <Styles.Actions>
          <Button label="I got it" onClick={onNext} isLight />
        </Styles.Actions>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default AnalyticsData
