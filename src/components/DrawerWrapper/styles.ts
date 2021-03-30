import styled from 'styled-components'

type TDrawerProps = {
  withIcon: boolean
}

const Wrapper = styled.div``

const Background = styled.div`
  position: fixed;
  z-index: 10;
  background-color: rgba(29, 29, 34, 0.2);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 250ms;
`

const Drawer = styled.div`
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
  padding: ${({ withIcon }: TDrawerProps) =>
    withIcon ? '20px 30px 30px 30px' : '40px 30px 30px 30px'};
  word-break: break-all;
  position: fixed;
  z-index: 11;
  left: 0;
  bottom: 0;
  width: 100%;
  transition: transform 250ms;
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

const IconRow = styled.div`
  margin: 0 0 20px 0;
  display: flex;
  justify-content: center;
`

const Icon = styled.img`
  width: 60px;
  height: 60px;
`

const Styles = {
  Wrapper,
  Background,
  Drawer,
  Title,
  IconRow,
  Icon,
}

export default Styles
