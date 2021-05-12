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
  size: number
}

const Container = styled.div`
  width: ${({ size }: TContainerProps) => `${size}px`};
  height: ${({ size }: TContainerProps) => `${size}px`};
  margin-left: ${({ ml }: TContainerProps) => (ml ? `${ml}px` : '0')};

  svg {
    animation: ${rotating} 1s infinite linear;
  }
`

const Styles = {
  Container,
}

export default Styles
