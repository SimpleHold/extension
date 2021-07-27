import styled from 'styled-components'

import txHistoryIcon from '@assets/icons/txHistory.svg'

const Container = styled.div`
  background-color: #ffffff;
  border-top: rgba(222, 225, 233, 0.5);
  flex: 1;
`

const EmptyHistory = styled.div`
  height: 100%;
  padding: 0 38px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

const Heading = styled.div`
  padding: 24px 30px 0 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const HeadingRow = styled.div`
  flex: 1;
`

const Title = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const SubTitleRow = styled.div`
  margin: 5px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const SubTitle = styled.p`
  margin: 0 6px 0 0;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: rgba(125, 126, 141, 0.5);
`

const Icon = styled.div`
  width: 12px;
  height: 12px;
  background-color: red;
`

const HeadingButton = styled.div`
  width: 40px;
  height: 30px;
  background: rgba(242, 244, 248, 0.7);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }
  }
`

const TxGroup = styled.div`
  margin: 20px 0 0 0;
`

const TxDate = styled.p`
  margin: 0 0 0 30px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #bdc4d4;
`

const Styles = {
  Container,
  EmptyHistory,
  EmptyHistoryIcon,
  EmptyHistoryText,
  Heading,
  HeadingRow,
  Title,
  SubTitleRow,
  SubTitle,
  Icon,
  HeadingButton,
  TxGroup,
  TxDate,
}

export default Styles
