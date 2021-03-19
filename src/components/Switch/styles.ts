import styled from 'styled-components'

type TContainerProps = {
  isActive: boolean
}

const Container = styled.div`
  width: 20px;
  height: 10px;
  border: ${({ isActive }: TContainerProps) => `1.5px solid ${isActive ? '#3FBB7D' : '#C3C3C3'}`};
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 3px 0;

  div {
    background-color: ${({ isActive }: TContainerProps) =>
      `1.5px solid ${isActive ? '#3FBB7D' : '#C3C3C3'}`};
    transform: ${({ isActive }: TContainerProps) => `translateX(${isActive ? '10px' : '0'})`};
    background-color: ${({ isActive }: TContainerProps) => (isActive ? '#3FBB7D' : '#C3C3C3')};
  }
`

const Dot = styled.div`
  transition: all 0.2s;
  width: 4px;
  height: 4px;
  border-radius: 2px;
`

const Styles = {
  Container,
  Dot,
}

export default Styles
