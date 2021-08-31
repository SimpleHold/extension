import styled from 'styled-components'

import txHistoryIcon from '@assets/icons/txHistory.svg'

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  height: 540px;
`

const Heading = styled.div`
  padding: 20px 30px 10px 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
`

const Button = styled.div`
  width: 40px;
  height: 30px;
  background-color: #f2f4f8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #7d7e8d;
  }

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }
  }
`

const Group = styled.div``

const GroupDateRow = styled.div`
  margin: 0 0 0 30px;
`

const GroupDate = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #bdc4d4;
`

const EmptyHistory = styled.div`
  display: flex;
  flex-direction: column;
  padding: 120px 62px 0 62px;
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
  margin: 20px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #7d7e8d;
`

const TxList = styled.div``

const SpinnerRow = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`

const Styles = {
  Wrapper,
  Container,
  Heading,
  Title,
  Button,
  Group,
  GroupDateRow,
  GroupDate,
  EmptyHistory,
  EmptyHistoryIcon,
  EmptyHistoryText,
  TxList,
  SpinnerRow,
}

export default Styles
