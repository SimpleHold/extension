import styled from 'styled-components'

type TContainerProps = {
  isActive: boolean
}

const colors = {
  active: '#3FBB7D',
  disabled: '#C3C3C3',
}

const Container = styled.div`
  width: 24px;
  height: 12px;
  border: ${({ isActive }: TContainerProps) =>
    `1.5px solid ${isActive ? colors.active : colors.disabled}`};
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 3px 0;

  div {
    background-color: ${({ isActive }: TContainerProps) =>
      `1.5px solid ${isActive ? colors.active : colors.disabled}`};
    transform: ${({ isActive }: TContainerProps) => `translateX(${isActive ? '13px' : '1px'})`};
    background-color: ${({ isActive }: TContainerProps) =>
      isActive ? colors.active : colors.disabled};
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
