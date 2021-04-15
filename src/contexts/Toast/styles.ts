import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 15px;
`

const Toast = styled.div`
  background-color: #7d7e8d;
  backdrop-filter: blur(30px);
  padding: 15px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  position: relative;
`

const ToastText = styled.p`
  margin: 0 20px 0 0;
  font-size: 14px;
  line-height: 18px;
  color: #ffffff;
`

const CloseIconRow = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;

  &:hover {
    cursor: pointer;
  }
`

const Styles = {
  Container,
  Toast,
  ToastText,
  CloseIconRow,
}

export default Styles
