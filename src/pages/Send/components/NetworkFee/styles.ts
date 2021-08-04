import styled from 'styled-components'

type TFeeProps = {
  isError: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px 20px;
  border-top: 1px solid #f2f4f8;
`

const Row = styled.div`
  flex: 1;
`

const Label = styled.p`
  margin: 0 0 4px 0;
  font-size: 12px;
  line-height: 14px;
  text-transform: capitalize;
  color: #7d7e8d;
`

const Fee = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  text-transform: capitalize;
  color: ${({ isError }: TFeeProps) => (isError ? '#EB5757' : '#1d1d22')};
`

const FeeRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const IconRow = styled.div`
  margin: 0 0 0 6px;

  path {
    fill: #eb5757;
  }
`

const Styles = {
  Container,
  Row,
  Label,
  Fee,
  FeeRow,
  IconRow,
}

export default Styles
