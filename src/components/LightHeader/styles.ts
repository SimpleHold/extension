import styled from 'styled-components'

type TButtonProps = {
  disabled?: boolean
}

const Container = styled.div`
  width: 100%;
  height: 55px;
  border-bottom: 1px solid #ebebee;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`

const Button = styled.div`
  width: 24px;
  height: 24px;

  &:hover {
    cursor: ${({ disabled }: TButtonProps) => (disabled ? 'default' : 'pointer')};
  }
`

const Title = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 17px;
  line-height: 21px;
  color: #1d1d22;
`

const Styles = {
  Container,
  Button,
  Title,
}

export default Styles
