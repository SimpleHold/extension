import styled from 'styled-components'

import txHistoryIcon from '@assets/icons/txHistory.svg'

const Container = styled.div`
  background-color: #ffffff;
  border-top: 1px solid rgba(222, 225, 233, 0.5);
  flex: 1;
  padding: 30px 0 0 0;
`

const Title = styled.p`
  margin: 0 0 0 30px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const EmptyHistory = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 62px 0 62px;
  align-items: center;
`

const EmptyHistoryIcon = styled.div`
  width: 50px;
  height: 50px;
  background-image: url(${txHistoryIcon});
  background-repeat: no-repeat;
  background-size: contain;
`

const EmptyHistoryText = styled.p`
  margin: 10px 0 0 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #7d7e8d;
`

const TxGroup = styled.div`
  margin: 16px 0 0 0;
`

const DateRow = styled.div`
  margin: 0 0 0 30px;
`

const TxDate = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #bdc4d4;
`

const Styles = {
  Container,
  Title,
  EmptyHistory,
  EmptyHistoryIcon,
  EmptyHistoryText,
  TxGroup,
  DateRow,
  TxDate,
}

export default Styles
