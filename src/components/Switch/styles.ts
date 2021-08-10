import styled from 'styled-components'

type TContainerProps = {
  isActive: boolean
}

const colors = {
  active: '#3FBB7D',
  disabled: '#BDC4D4',
}

const Container = styled.div`
  width: 24px;
  height: 12px;
  border: ${({ isActive }: TContainerProps) =>
    `1px solid ${isActive ? '#A6D9BC' : colors.disabled}`};
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 3px 0;
  background-color: #f2f4f8;

  div {
    transform: ${({ isActive }: TContainerProps) => `translateX(${isActive ? '13px' : '2px'})`};
    background-color: ${({ isActive }: TContainerProps) =>
      isActive ? colors.active : colors.disabled};
  }

  &:hover {
    cursor: pointer;
    border: 1px solid #3fbb7d;

    div {
      background-color: #3fbb7d;
    }
  }
`

const Dot = styled.div`
  transition: all 0.2s;
  width: 6px;
  height: 6px;
  border-radius: 3px;
`

const Styles = {
  Container,
  Dot,
}

export default Styles
