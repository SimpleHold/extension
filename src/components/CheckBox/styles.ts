import styled from 'styled-components'

type TContainerProps = {
  isDisabled?: boolean
  color?: string
  size: number
}

const Container = styled.div`
  width: ${({ size }: TContainerProps) => `${size}px`};
  height: ${({ size }: TContainerProps) => `${size}px`};
  border: ${({ color, isDisabled }: TContainerProps) =>
    `1.5px solid ${color || isDisabled ? '#C3C3C3' : '#7d7e8d'}`};
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: ${({ color, isDisabled }: TContainerProps) =>
      color || isDisabled ? '#C3C3C3' : '#7d7e8d'};
  }

  &:hover {
    cursor: ${({ isDisabled }: TContainerProps) => (isDisabled ? 'default' : 'pointer')};
    border: ${({ isDisabled }: TContainerProps) =>
      `1.5px solid ${isDisabled ? '#C3C3C3' : '#3fbb7d'}`};

    path {
      fill: ${({ isDisabled }: TContainerProps) => (isDisabled ? '#C3C3C3' : '#3fbb7d')};
    }
  }
`

const Styles = {
  Container,
}

export default Styles
