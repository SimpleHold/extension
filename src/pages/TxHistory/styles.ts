import styled from 'styled-components'

import txHistoryIcon from '@assets/icons/txHistory.svg'
import txLoadingIcon from '@assets/icons/txLoading.svg'

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
  position: relative;

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

const Group = styled.div`
  &:not(:first-child) {
    margin: 10px 0 0 0;
  }
`

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
  color: #1d1d22;
`

const TxList = styled.div`
  height: 100%;
  overflow-y: scroll;
`

const ButtonDot = styled.div`
  width: 6px;
  height: 6px;
  background-color: #eb5757;
  position: absolute;
  top: 6px;
  right: 8px;
  border-radius: 3px;
`

const Loading = styled.div`
  position: relative;
`

const LoadingBackground = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 100%);
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 120px 0 0 0;
`

const LoadingImageRow = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const LoadingImage = styled.div`
  width: 46px;
  height: 50px;
  background-image: url(${txLoadingIcon});
  background-repeat: no-repeat;
  background-size: contain;
  position: relative;

  & > div {
    position: absolute;
    top: 30px;
    right: 2px;
  }
`

const LoadingText = styled.p`
  margin: 20px 0 0 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 23px;
  color: #1d1d22;
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
  ButtonDot,
  Loading,
  LoadingBackground,
  LoadingImageRow,
  LoadingImage,
  LoadingText,
}

export default Styles
