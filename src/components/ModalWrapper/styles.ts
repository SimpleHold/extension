import styled from 'styled-components'

type TContainerProps = {
  isActive: boolean
}

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: ${({ isActive }: TContainerProps) => (isActive ? 'block' : 'none')};
`

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(29, 29, 34, 0.2);
  backdrop-filter: blur(4px);
  align-items: center;
  justify-content: center;
  display: flex;
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
