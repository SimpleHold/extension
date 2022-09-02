import styled from 'styled-components'

type TProps = {
  isActive: boolean
}

const Container = styled.div`
  box-shadow: 0px -2px 20px rgba(125, 126, 141, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  background-color: #fff;
  height: 60px;
  position: absolute;
  bottom: 0;
  z-index: 9;
`

const Button = styled.div`
  height: 40px;
  transition: 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  svg {
    margin-bottom: 2px;
    transition: 0.2s ease;
    path {
      fill: ${({ isActive }: TProps) => isActive ? '#3FBB7D' : '#BDC4D4'};
    }
  }
  

  :hover {
    svg {
      transform: ${({ isActive }: TProps) => isActive ? 'none' : 'translateY(-2px)'};
    }
  }
`

const Label = styled.p`
  margin: 0;
  transition: 200ms all;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.38px;
  text-transform: capitalize;
  color: ${({ isActive }: TProps) => isActive ? '#3FBB7D' : '#9C9CAC'};
`

const Styles = {
  Container,
  Button,
  Label
}

export default Styles
