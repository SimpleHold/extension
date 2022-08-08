import styled from 'styled-components'

const DimScreen = styled.div`
  z-index: 11;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 16px;
  animation: fadeInAnimation ease 0.1s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;

  @keyframes fadeInAnimation {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

const Container = styled.div`
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  animation: pop-in ease 0.3s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;

  @keyframes pop-in {
    0% {
      opacity: 0;
      -webkit-transform: scale(0.5);
    }
    100% {
      opacity: 1;
      -webkit-transform: scale(1);
    }
  }
`

const Styles = {
  DimScreen,
  Container,
}

export default Styles
