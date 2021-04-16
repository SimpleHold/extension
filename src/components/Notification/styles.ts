import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  padding: 15px;
  background: #7d7e8d;
  bottom: 15px;
  z-index: 123123;
  width: calc(100% - 30px);
  margin: 0 0 0 15px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`

const Text = styled.p`
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  color: #ffffff;
  margin: 0 20px 0 0;
`

const CloseIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
`

const Styles = {
  Wrapper,
  Text,
  CloseIcon,
}

export default Styles
