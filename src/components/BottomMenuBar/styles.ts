import styled from 'styled-components'

type TProps = {
  isActive: boolean
}

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  background-color: #fff;
  height: 50px;
  position: absolute;
  bottom: 0;
  z-index: 9;
`

const Button = styled.div`
  width: 24px;
  height: 24px;
  transition: 0.2s ease;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  path {
    fill: ${({ isActive }: TProps) => isActive ? '#7987A7' : '#BDC4D4'};
  }

  :hover {
    transform: scale(1.05);
  }
`

const Styles = {
  Container,
  Button,
}

export default Styles
