import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Textarea from '@components/Textarea'
import Button from '@components/Button'

// Utils
import { sendFeedback } from '@utils/api'
import { getItem } from '@utils/storage'

// Hooks
import useState from '@hooks/useState'

// Types
import { IProps, IState } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  rating: 0,
  feedback: '',
  isLoading: false,
  isSent: false,
}

const FeedbackDrawer: React.FC<IProps> = (props) => {
  const { onClose, isActive } = props

  const { state, updateState } = useState<IState>(initialState)

  const onClickGrade = (rating: number) => (): void => {
    if (state.rating !== rating && !state.isLoading) {
      updateState({ rating })
    }
  }

  const onSend = async (): Promise<void> => {
    const clientId = getItem('clientId')

    if (clientId) {
      updateState({ isLoading: true })

      try {
        await sendFeedback(clientId, state.feedback, state.rating)
      } catch {}

      updateState({ isLoading: false, isSent: true })
    }
  }

  const setFeedback = (feedback: string): void => {
    updateState({ feedback })
  }

  return (
    <DrawerWrapper
      title={
        state.isSent
          ? 'Thank you for your feedback!'
          : 'How likely is it that you will recommend us?'
      }
      isActive={isActive}
      onClose={onClose}
      withCloseIcon
      icon={state.isSent ? '../../assets/drawer/success.svg' : undefined}
    >
      <Styles.Row>
        {!state.isSent ? (
          <>
            <Styles.Grade>
              {Array(10)
                .fill('grade')
                .map((i: string, index: number) => {
                  const number = index + 1
                  const isActive = state.rating >= number

                  return (
                    <Styles.GradeItem
                      key={`${i}/${index}`}
                      onClick={onClickGrade(number)}
                      isActive={isActive}
                      disabled={state.isLoading}
                    >
                      <Styles.GradeItemNumber>{number}</Styles.GradeItemNumber>
                    </Styles.GradeItem>
                  )
                })}
            </Styles.Grade>
            <Textarea
              label="What could we do to improve?"
              value={state.feedback}
              onChange={setFeedback}
              height={180}
              disabled={state.isLoading}
            />
          </>
        ) : null}
        <Button
          label={state.isSent ? 'Close' : 'Send feedback'}
          onClick={state.isSent ? onClose : onSend}
          mt={15}
          disabled={state.rating === 0 || !state.feedback.length}
          isLoading={state.isLoading}
        />
      </Styles.Row>
    </DrawerWrapper>
  )
}

export default FeedbackDrawer
