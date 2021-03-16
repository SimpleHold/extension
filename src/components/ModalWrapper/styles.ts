import styled, { keyframes } from 'styled-components'

const scaleUp = keyframes`
  0% {
    transform: scale(.8) translateY(1000px);
    opacity: 0;
  }
  
  100% {
    transform: scale(1) translateY(0px);
    opacity: 1;
  }
`

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform: scale(0);
  z-index: 3;

  &.active {
    transform: scale(1);
  }
`

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(29, 29, 34, 0.2);
  backdrop-filter: blur(4px);
  align-items: center;
  justify-content: center;
  display: flex;
  backdrop-filter: blur(4px);
`

const Modal = styled.div`
  background-color: #ffffff;
  border-radius: 5px;
  width: 315px;
  padding: 55px 30px 30px 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: scale(0);

  &.active {
    transform: scale(1);
    animation: ${scaleUp} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  }
`

const Circle = styled.div`
  width: 90px;
  height: 90px;
  position: absolute;
  top: -45px;
`

const Icon = styled.img`
  width: 90px;
  height: 90px;
`

const Styles = {
  Container,
  Background,
  Modal,
  Circle,
  Icon,
}

export default Styles
