import styled from 'styled-components'
import NumberFormat from 'react-number-format'

type TButtonProps = {
  isDisabled: boolean
}

const Container = styled.div`
  background-color: #f5f5f7;
  border-radius: 16px;
`

const Row = styled.div`
  padding: 32px 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Button = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: ${({ isDisabled }: TButtonProps) => (isDisabled ? 'default' : 'pointer')};
  }
`

const AmountRow = styled.div`
  flex: 1;
  padding: 0 10px;
  overflow: hidden;
`

const Estimated = styled.p`
  margin: 4px 0 0 0;
  font-weight: 500;
  font-size: 17px;
  line-height: 21px;
  text-align: center;
  color: #b0b0bd;
  overflow: hidden;
  white-space: pre;
`

const ButtonLabel = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  color: #3fbb7d;
`

const Input = styled(NumberFormat)`
  text-align: center;
  font-weight: 700;
  font-size: 34px;
  line-height: 36px;
  color: #1d1d22;
  border: none;
  background: none;
  width: 100%;
  outline: none;
  height: 36px;

  &::placeholder {
    color: #1d1d22;
    opacity: 1;
  }

  &:-ms-input-placeholder {
    color: #1d1d22;
  }

  &::-ms-input-placeholder {
    color: #1d1d22;
  }
`

const Styles = {
  Container,
  Row,
  Button,
  AmountRow,
  Estimated,
  ButtonLabel,
  Input,
}

export default Styles
