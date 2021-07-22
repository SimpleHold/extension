import styled from 'styled-components'

type TContainerProps = {
  color?: string
}

const Container = styled.div`
  width: 13px;
  height: 13px;
  border: ${({ color }: TContainerProps) => `1.5px solid ${color || '#7d7e8d'}`};
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: ${({ color }: TContainerProps) => color || '#7d7e8d'};
  }

  &:hover {
    border: 1.5px solid #3fbb7d;
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }
  }
`

const Styles = {
  Container,
}

export default Styles
