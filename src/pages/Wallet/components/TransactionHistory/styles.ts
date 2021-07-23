import styled from 'styled-components'

import txHistoryIcon from '@assets/icons/txHistory.svg'

const Container = styled.div`
  background-color: #ffffff;
  border-top: rgba(222, 225, 233, 0.5);
  height: 100%;
`

const Heading = styled.div`
  padding: 24px 30px 20px 30px;
`

const HeadingRow = styled.div``

const Title = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const Body = styled.div``

const Date = styled.p`
  margin: 0 0 0 30px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #bdc4d4;
`

const EmptyHistory = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const EmptyHistoryIcon = styled.div`
  width: 46px;
  height: 50px;
  background-image: url(${txHistoryIcon});
  background-repeat: no-repeat;
  background-size: contain;
`

const EmptyHistoryText = styled.p`
  margin: 15px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #7d7e8d;
`

const Styles = {
  Container,
  Heading,
  HeadingRow,
  Title,
  Body,
  Date,
  EmptyHistory,
  EmptyHistoryIcon,
  EmptyHistoryText,
}

export default Styles
