import styled from 'styled-components'

type TExtraIdProps = {
  withExtraid: boolean
}

const Row = styled.div`
  padding: ${({ withExtraid }: TExtraIdProps) =>
    withExtraid ? '30px 30px 25px 30px' : '20px 30px 40px 30px'};
`

const PageTitle = styled.p`
  margin: 0 0 20px 0;
  font-size: 16px;
  line-height: 19px;
  color: #c3c3c3;
`

const Balance = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 36px;
  line-height: 36px;
  color: #1d1d22;
`

const USDEstimated = styled.p`
  margin: 10px 0 0 0;
  font-size: 20px;
  line-height: 23px;
  color: #7d7e8d;
`

const Styles = {
  Row,
  PageTitle,
  Balance,
  USDEstimated,
}

export default Styles
