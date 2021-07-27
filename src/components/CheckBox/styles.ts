import styled from 'styled-components'

type TContainerProps = {
  isDisabled?: boolean
  color?: string
}

const Container = styled.div`
  width: 13px;
  height: 13px;
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
