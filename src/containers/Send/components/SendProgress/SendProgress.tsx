import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import sendIcon from '@assets/icons/sendSteps/send.svg'
import enterAddressIcon from '@assets/icons/sendSteps/enterAddress.svg'
import confirmIcon from '@assets/icons/sendSteps/confirm.svg'

// Styles
import Styles from './styles'

interface Props {
  step: 'send' | 'enterAddress' | 'confirm'
  pb?: number
}

type TStep = {
  key: string
  icon: string
}

const steps: TStep[] = [
  {
    key: 'send',
    icon: sendIcon,
  },
  {
    key: 'enterAddress',
    icon: enterAddressIcon,
  },
  {
    key: 'confirm',
    icon: confirmIcon,
  },
]

const SendProgress: React.FC<Props> = (props) => {
  const { step, pb = 16 } = props

  const activeIndex = steps.findIndex((item) => item.key === step)

  return (
    <Styles.Container pb={pb}>
      {steps.map((item: TStep, index: number) => {
        const { key, icon } = item

        const isActive = key === step
        const isPassed = activeIndex > index

        return (
          <Styles.Item key={key}>
            <Styles.StepRow className={isActive ? 'active' : ''}>
              {isActive ? (
                <SVG src={icon} width={12} height={12} />
              ) : (
                <Styles.StepRowDot className={isPassed ? 'active' : ''} />
              )}
            </Styles.StepRow>
            {index !== steps.length - 1 ? (
              <Styles.Line className={isPassed ? 'active' : ''} />
            ) : null}
          </Styles.Item>
        )
      })}
    </Styles.Container>
  )
}

export default SendProgress
