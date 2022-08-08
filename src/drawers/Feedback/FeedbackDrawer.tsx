import * as React from 'react'

// Components
import DrawerWrapper from '@components/DrawerWrapper'
import Textarea from '@components/Textarea'
import Button from '@components/Button'

// Utils
import { sendFeedback } from '@utils/api'
import { getItem } from '@utils/storage'
import { logEvent } from '@utils/amplitude'

// Hooks
import useState from '@hooks/useState'

// Config
import { NPS_CONFIRM, NPS_COMMENT, NPS_SCORE, NPS_OUT } from '@config/events'

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
  const { onClose, isActive, openFrom } = props

  const { state, updateState } = useState<IState>(initialState)

  const onClickGrade = (rating: number) => (): void => {
    if (state.rating !== rating && !state.isLoading) {
      updateState({ rating })

      logEvent({
        name: NPS_SCORE,
        properties: {
          score: rating,
        },
      })
    }
  }

  const onSend = async (): Promise<void> => {
    const clientId = getItem('clientId')

    if (clientId) {
      updateState({ isLoading: true })

      await sendFeedback(clientId, state.feedback, state.rating)

      if (state.feedback) {
        logEvent({
          name: NPS_COMMENT,
          properties: {
            comment: state.feedback,
          },
        })
      }

      logEvent({
        name: NPS_CONFIRM,
        properties: {
          rating: state.rating,
        },
      })

      updateState({ isLoading: false, isSent: true })
    }
  }

  const setFeedback = (feedback: string): void => {
    updateState({ feedback })
  }

  const onClickClose = () => {
    if (state.feedback) {
      logEvent({
        name: NPS_COMMENT,
        properties: {
          comment: state.feedback,
        },
      })
    }

    if (!state.isSent) {
      logEvent({
        name: NPS_OUT
      })
    }

    onClose()
  }

  return (
    <DrawerWrapper
      title={state.isSent ? 'Thank you for your feedback!' : 'How likely are you to recommend us?'}
      isActive={isActive}
      onClose={onClickClose}
      withCloseIcon
      icon={state.isSent ? '../../assets/drawer/success.svg' : undefined}
      openFrom={openFrom}
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
