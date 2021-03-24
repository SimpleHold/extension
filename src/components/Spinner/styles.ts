import styled, { keyframes } from 'styled-components'

const rotating = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

type TContainerProps = {
  ml?: number
}

const Container = styled.div`
  width: 16px;
  height: 16px;
  margin-left: ${({ ml }: TContainerProps) => (ml ? `${ml}px` : '0')};

  svg {
    animation: ${rotating} 1s infinite linear;
  }
`

const Styles = {
  Container,
}

export default Styles
