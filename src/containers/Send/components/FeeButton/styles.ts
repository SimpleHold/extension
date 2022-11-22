import styled from 'styled-components'

type TContainerProps = {
  isDisabled: boolean
}

type TRowProps = {
  withWarning: boolean
}

const Container = styled.div`
  padding: 0 8px 8px 8px;

  &:hover {
    cursor: ${({ isDisabled }: TContainerProps) => (isDisabled ? 'default' : 'pointer')};
  }
`

const Row = styled.div`
  background-color: #ffffff;
  border-radius: ${({ withWarning }: TRowProps) => (withWarning ? '16px' : '4px 4px 16px 16px')};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 44px;
`

const FeeLabel = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  color: #3fbb7d;
  text-transform: capitalize;
`

const Fee = styled.p`
  margin: 0 4px;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  color: #3fbb7d;
`

const Styles = {
  Container,
  Row,
  FeeLabel,
  Fee,
}

export default Styles
