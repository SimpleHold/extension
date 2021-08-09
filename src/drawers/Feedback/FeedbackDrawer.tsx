import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Textarea from '@components/Textarea'
import Button from '@components/Button'

// Styles
import Styles from './styles'

interface Props {
  onClose: () => void
  isActive: boolean
}

const FeedbackDrawer: React.FC<Props> = (props) => {
  const { onClose, isActive } = props

  const [selectedGrade, setGrade] = React.useState<number>(0)
  const [feedback, setFeedback] = React.useState<string>('')
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isSent, setIsSent] = React.useState<boolean>(false)

  const onClickGrade = (number: number) => (): void => {
    if (selectedGrade !== number) {
      setGrade(number)
    }
  }

  const onSend = (): void => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setIsSent(true)
    }, 2000)
  }

  return (
    <DrawerWrapper
      title={
        isSent ? 'Thank you for your feedback!' : 'How likely is it that you will recommend us?'
      }
      isActive={isActive}
      onClose={onClose}
      withCloseIcon
      icon={isSent ? '../../assets/drawer/success.svg' : undefined}
    >
      <Styles.Row>
        {!isSent ? (
          <>
            <Styles.Grade>
              {Array(10)
                .fill('grade')
                .map((i: string, index: number) => {
                  const number = index + 1
                  const isActive = selectedGrade >= number

                  return (
                    <Styles.GradeItem
                      key={`${i}/${index}`}
                      onClick={onClickGrade(number)}
                      isActive={isActive}
                    >
                      <Styles.GradeItemNumber>{number}</Styles.GradeItemNumber>
                    </Styles.GradeItem>
                  )
                })}
            </Styles.Grade>
            <Textarea
              label="What could we do to improve?"
              value={feedback}
              onChange={setFeedback}
            />
          </>
        ) : null}
        <Button
          label="Send feedback"
          onClick={onSend}
          mt={15}
          disabled={selectedGrade === 0 || !feedback.length}
          isLoading={isLoading}
        />
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default FeedbackDrawer
