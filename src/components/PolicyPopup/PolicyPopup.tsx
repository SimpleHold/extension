import * as React from 'react'
import SVG from 'react-inlinesvg'

// Assets
import documentsIcon from '@assets/icons/documentsIcon.svg'
import arrowIcon from '@assets/icons/arrowRight.svg'

// Config
import { ANALYTICS_OK } from '@config/events'

// Components
import Popup from '@components/Popup'
import Button from '@components/Button'

// Utils
import { openWebPage } from '@utils/extension'
import { setItem } from '@utils/storage'
import { logEvent } from '@utils/amplitude'

// Styles
import Styles from './styles'

interface Props {
  onBlur?:() => void
  onClose:() => void
}

const PolicyPopup: React.FC<Props> = ({ onBlur, onClose }) => {

  const onBlurHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    onBlur && onBlur()
  }

  const onClickAgree = () => {
    setItem('analytics', 'agreed')

    logEvent({
      name: ANALYTICS_OK,
      properties: {
        option: "ok"
      }
    })
    onClose()
  }

  const onClickLater = () => {
    logEvent({
      name: ANALYTICS_OK,
      properties: {
        option: "later"
      }
    })
    onClose()
  }

  return (
    <Popup>
      <Styles.Wrapper onClick={onBlurHandler}>
        <Styles.Title>
          Help Us to Improve Our App
        </Styles.Title>
        <Styles.Description>
          SimpleHold would like to gather usage data to understand better how users interact with the wallet. This data
          will be used only for improving the usability and user experience
          of our product.
        </Styles.Description>
        <Styles.Links>
          <Styles.LinkItem onClick={() => openWebPage('https://simplehold.io/privacy')}>
            <Styles.DocumentsIcon>
              <SVG src={documentsIcon} width={16} height={16} />
            </Styles.DocumentsIcon>
            <span>Privacy Policy</span>
            <SVG src={arrowIcon} width={6} height={14} className={'arrow'}/>
          </Styles.LinkItem>
          <Styles.LinkItem onClick={() => openWebPage('https://simplehold.io/terms')}>
            <Styles.DocumentsIcon>
              <SVG src={documentsIcon} width={16} height={16} />
            </Styles.DocumentsIcon>
            <span>Terms of Use</span>
            <SVG src={arrowIcon} width={6} height={14} className={'arrow'}/>
          </Styles.LinkItem>
        </Styles.Links>
        <Styles.Buttons>
          <Button label={'Agree'} onClick={onClickAgree} />
          <Button label={'Maybe later'} onClick={onClickLater} />
        </Styles.Buttons>
      </Styles.Wrapper>
    </Popup>
  )
}

export default PolicyPopup


