import styled from 'styled-components'

type TProps = {
  isCollapsed: boolean
  hide?: boolean
}

const Animations = styled.div`
  // folded
  .folded-enter {
    opacity: 0;
  }

  .folded-enter-active {
    opacity: 1;
    transition: all 400ms;
  }

  .folded-exit {
    opacity: 1;
  }

  .folded-exit-active {
    opacity: 0;
    top: -10px;
    transition: all 400ms;
  }

  // unfolded
  .unfolded-enter {
    opacity: 0;
    transform: scale(1.2);
  }

  .unfolded-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: all 400ms;
  }

  .unfolded-exit {
    opacity: 1;
  }

  .unfolded-exit-active {
    opacity: 0;
    transition: all 180ms;
  }
`

const ListContainer = styled.div`
  width: 100%;
  height: 40px;
`

const Styles = {
  Animations,
  ListContainer,
}

export default Styles
