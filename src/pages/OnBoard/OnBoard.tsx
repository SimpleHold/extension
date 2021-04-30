import * as React from 'react'
import SVG from 'react-inlinesvg'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'

// Assets
import illustrate1 from '@assets/illustrate/onboard1.svg'
import illustrate2 from '@assets/illustrate/onboard2.svg'
import illustrate3 from '@assets/illustrate/onboard3.svg'
import arrowIcon from '@assets/icons/arrow.svg'

// Utils
import { logEvent } from '@utils/amplitude'

// Styles
import Styles from './styles'

const OnBoard: React.FC = () => {
  const history = useHistory()

  const [currentStep, setCurrentStep] = React.useState<number>(0)

  React.useEffect(() => {
    logEvent({
      name: `ONBOARDING_${currentStep + 1}`,
    })
  }, [currentStep])

  const steps = [
    {
      image: illustrate1,
      title: 'Hello!',
      description:
        'Welcome to the new crypto wallet from SimpleSwap! Take a little tour before you can start',
    },
    {
      image: illustrate2,
      title: '100% light wallet',
      description:
        "We don't have access to your private keys, so only you can manage your funds. Be careful, always update your backup and keep it in a safe place",
    },
    {
      image: illustrate3,
      title: 'Support',
      description:
        'Our support team is always glad to help you. Share your feedback or ask questions here. Besides that you can read more about us at our knowledge base',
    },
  ]

  const onNext = (): void => {
    if (currentStep !== 2) {
      setCurrentStep(currentStep + 1)
    } else {
      localStorage.setItem('onBoard', 'passed')
      history.push('/analytics-data')
    }
  }

  return (
    <Styles.Wrapper>
      <Header noActions logoColor="#3FBB7D" withBorder />
      <Styles.Container>
        <Styles.Row>
          <Styles.Illustrate src={steps[currentStep].image} alt="illustrate" />
          <Styles.Title>{steps[currentStep].title}</Styles.Title>
          <Styles.Description>{steps[currentStep].description}</Styles.Description>
        </Styles.Row>
        <Styles.Footer>
          <Styles.Progress>
            {Array(steps.length)
              .fill('step')
              .map((i: string, index: number) => (
                <Styles.ProgressDot key={`${i}/${index}`} isCurrent={index === currentStep} />
              ))}
          </Styles.Progress>
          <Styles.NextBlock onClick={onNext}>
            <Styles.NextLabel>{currentStep === 2 ? 'Let’s start' : 'Next'}</Styles.NextLabel>
            <Styles.ArrowIconRow>
              <SVG src={arrowIcon} width={6} height={10} title="arrow" />
            </Styles.ArrowIconRow>
          </Styles.NextBlock>
        </Styles.Footer>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default OnBoard
