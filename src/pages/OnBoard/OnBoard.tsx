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

// SwapSpace
import swapSpaceStep1 from '@assets/theme/swapspace/1.svg'
import swapSpaceStep2 from '@assets/theme/swapspace/2.svg'
import swapSpaceStep3 from '@assets/theme/swapspace/3.svg'

// Utils
import { logEvent } from '@utils/amplitude'
import { setItem } from '@utils/storage'
import { getAllCookies, Cookie } from '@utils/extension'
import { toLower } from '@utils/format'

// Styles
import Styles from './styles'

type TTheme = {
  [key: string]: {
    image: string
    title: string
    description: string
  }[]
}

const themes: TTheme = {
  simplehold: [
    {
      image: illustrate1,
      title: 'Hello!',
      description:
        'Welcome to the new crypto wallet from SimpleSwap! Take a little tour before you can start.',
    },
    {
      image: illustrate2,
      title: '100% light wallet',
      description:
        "We don't have access to your private keys, so only you can manage your funds. Be careful, always update your backup and keep it in a safe place.",
    },
    {
      image: illustrate3,
      title: 'Support',
      description:
        'Our support team is always glad to help you. Share your feedback or ask questions here. Besides that you can read more about us at our knowledge base.',
    },
  ],
  swapspace: [
    {
      image: swapSpaceStep1,
      title: 'Hello!',
      description:
        'Welcome to the SimpleHold crypto wallet! We are glad that you come here from SwapSpace as it is our reliable partner.',
    },
    {
      image: swapSpaceStep2,
      title: 'Simple',
      description:
        'Use our crypto wallet on SwapSpace to make fast and simple exchanges. Please remember it is crucial that you keep your backup in a safe place.',
    },
    {
      image: swapSpaceStep3,
      title: 'Support',
      description:
        'Our support team is always ready to help you with the SimpleHold wallet. Please contact SwapSpace if any issues with your exchange arise.',
    },
  ],
}

const OnBoard: React.FC = () => {
  const history = useHistory()

  const [currentStep, setCurrentStep] = React.useState<number>(0)
  const [theme, setTheme] = React.useState<'simplehold' | 'swapspace'>('simplehold')

  React.useEffect(() => {
    getCookies()
  }, [])

  React.useEffect(() => {
    logEvent({
      name: `ONBOARDING_${currentStep + 1}`,
    })
  }, [currentStep])

  const getCookies = async () => {
    const cookies = await getAllCookies('https://simplehold.io')

    const getRef = cookies.find((cookie: Cookie) => cookie.name === 'ref')

    if (getRef) {
      const { value } = getRef

      if (toLower(value) === 'swapspace') {
        setTheme('swapspace')
      }
    }
  }

  const onNext = (): void => {
    if (currentStep !== 2) {
      setCurrentStep(currentStep + 1)
    } else {
      setItem('onBoard', 'passed')
      history.push('/analytics-data')
    }
  }

  return (
    <Styles.Wrapper theme={theme}>
      <Header
        noActions
        logoColor="#3FBB7D"
        withBorder
        borderColor={theme === 'swapspace' ? 'rgba(234, 234, 234, 0.2)' : undefined}
        isAbsolute
      />
      <Styles.Container className="container">
        <Styles.Row>
          <Styles.Illustrate
            className="slide"
            src={themes[theme][currentStep].image}
            alt="illustrate"
          />
          <Styles.Title className="title">{themes[theme][currentStep].title}</Styles.Title>
          <Styles.Description className="description">
            {themes[theme][currentStep].description}
          </Styles.Description>
        </Styles.Row>
        <Styles.Footer>
          <Styles.Progress>
            {Array(themes[theme].length)
              .fill('step')
              .map((i: string, index: number) => (
                <Styles.ProgressDot
                  key={`${i}/${index}`}
                  isCurrent={index === currentStep}
                  theme={theme}
                />
              ))}
          </Styles.Progress>
          <Styles.NextBlock onClick={onNext}>
            <Styles.NextLabel className="next">
              {currentStep === 2 ? 'Let’s start' : 'Next'}
            </Styles.NextLabel>
            <Styles.ArrowIconRow className="arrow">
              <SVG src={arrowIcon} width={6} height={10} title="arrow" />
            </Styles.ArrowIconRow>
          </Styles.NextBlock>
        </Styles.Footer>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default OnBoard
