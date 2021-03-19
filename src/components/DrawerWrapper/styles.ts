import styled from 'styled-components'

type TDrawerProps = {
  withIcon: boolean
}

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
  padding: ${({ withIcon }: TDrawerProps) =>
    withIcon ? '20px 30px 30px 30px' : '40px 30px 30px 30px'};
  transition: all 0.5s ease;
  transform: translateY(100%);

  &.active {
    transform: translateY(0px);
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
