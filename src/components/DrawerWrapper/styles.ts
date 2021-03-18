import styled, { keyframes } from 'styled-components'

const scaleUp = keyframes`
  0% {
    transform: scale(.8) translateY(100%);
    opacity: 0;
  }
  
  100% {
    transform: scale(1) translateY(0px);
    opacity: 1;
  }
`

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform: scale(0);

  &.active {
    transform: scale(1);
  }
`

const Background = styled.div`
  background: rgba(29, 29, 34, 0.2);
  backdrop-filter: blur(4px);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const Drawer = styled.div`
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
  padding: 40px 30px 30px 30px;
  transform: scale(0);

  &.active {
    transform: scale(1);
    animation: ${scaleUp} 0.5s linear forwards;
  }
`

const Title = styled.p`
  margin: 0;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: #1d1d22;
`

const Styles = {
  Wrapper,
  Background,
  Drawer,
  Title,
}

export default Styles
