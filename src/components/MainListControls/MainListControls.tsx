import * as React from 'react'
import { CSSTransition } from 'react-transition-group'

// Components
import ListControls, { TListControlsProps } from '@components/ListControls/ListControls'

// Styles
import Styles from './styles'

interface Props {
  controlsProps: Omit<TListControlsProps, 'isCollapsed'>
  isListUnfolded: boolean
}

const MainListControls: React.FC<Props> = (props) => {
  const { controlsProps, isListUnfolded } = props

  const [showFoldedMenu, setShowFoldedMenu] = React.useState(true)
  const [showUnfoldedMenu, setShowUnfoldedMenu] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleMounts = () => {
    ;(isListUnfolded ? setShowUnfoldedMenu : setShowFoldedMenu)(false)
    return setTimeout(() => (isListUnfolded ? setShowFoldedMenu : setShowUnfoldedMenu)(true), 200)
  }

  React.useEffect(() => {
    const id = handleMounts()
    return () => clearTimeout(id)
  }, [isListUnfolded])

  return (
    <Styles.Animations>
      {isMounted ? (
        <CSSTransition in={showFoldedMenu} timeout={400} classNames={'unfolded'} unmountOnExit>
          <ListControls {...controlsProps} isCollapsed />
        </CSSTransition>
      ) : null}

      <CSSTransition appear in={showUnfoldedMenu} timeout={400} classNames={'folded'} unmountOnExit>
        <ListControls {...controlsProps} />
      </CSSTransition>
    </Styles.Animations>
  )
}

export default MainListControls
