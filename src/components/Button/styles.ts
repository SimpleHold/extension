import styled from 'styled-components'

type TContainer = {
  disabled?: boolean
  ml?: number
  mr?: number
  isSmall?: boolean
  isLight?: boolean
  isDanger?: boolean
}

const Container = styled.button`
  width: 100%;
  height: ${({ isSmall }: TContainer) => (isSmall ? '50px' : '60px')};
  background-color: ${({ disabled, isLight }: TContainer) =>
    disabled ? '#EAEAEA' : isLight ? '#F8F8F8' : '#3fbb7d'};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  margin-left: ${({ ml }: TContainer) => (ml ? `${ml}px` : '0')};
  margin-right: ${({ mr }: TContainer) => (mr ? `${mr}px` : '0')};
  border: ${({ isLight }: TContainer) => (isLight ? '1px solid #EAEAEA' : 'none')};

  &:hover {
    cursor: ${({ disabled }: TContainer) => (disabled ? 'default' : 'pointer')};
    background-color: #31a76c;
  }

  p {
    color: ${({ isLight }: TContainer) => (isLight ? '#3FBB7D' : '#FFFFFF')};
  }
`

const Label = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  user-select: none;
`

const Styles = {
  Container,
  Label,
}

export default Styles
