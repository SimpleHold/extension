import styled from 'styled-components'

type TProps = {
  isCollapsed: boolean
  hide?: boolean
}

const Animations = styled.div`
  // folded
  .folded-enter {
    opacity: 0;
    //background-color: orange;
  }
  
  .folded-enter-active {
    opacity: 1;
    transition: all 400ms;

    //background-color: chartreuse;
  }
  
  .folded-exit {
    opacity: 1;
    //background-color: blue;
  }
  
  .folded-exit-active {
    opacity: 0;
    top: -10px;
    //background-color: red;
    transition: all 400ms;
  }

  // unfolded
  .unfolded-enter {
    opacity: 0;
    transform: scale(1.2);
    //background-color: orange;
  }
  
  .unfolded-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: all 400ms;

    //background-color: chartreuse;
  }

  .unfolded-exit {
    opacity: 1;
    //background-color: blue;
  }
  
  .unfolded-exit-active {
    opacity: 0;
    //background-color: red;
    transition: all 200ms;
  }
`

const ListContainer = styled.div`
  background-color: mediumpurple;
  position: relative;
  width: 100%;
  height: 40px;
`

const Styles = {
  Animations,
  ListContainer,
}

export default Styles
