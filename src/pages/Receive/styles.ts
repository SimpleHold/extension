import styled, { keyframes } from 'styled-components'

const rotating = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

type TRefreshIconRowProps = {
  isRefreshing: boolean
}

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
  height: 540px;
  overflow: hidden;
`

const ReceiveBlock = styled.div`
  border-top: 1px solid #eaeaea;
  padding: 16px 30px 40px 30px;
  background-color: #f8f8f8;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Row = styled.div`
  padding: 16px 30px 40px 30px;
  position: relative;
`

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const UpdateBalanceBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const BalanceLabel = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #c3c3c3;
`

const RefreshIconRow = styled.div`
  width: 24px;
  height: 24px;
  background-color: #c3c3c326;
  border-radius: 12px;
  margin: 0 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: ${({ isRefreshing }: TRefreshIconRowProps) => (isRefreshing ? '#3fbb7d' : '#c3c3c3')};
  }

  svg {
    animation: ${rotating} 2s infinite linear;
    animation-duration: ${({ isRefreshing }: TRefreshIconRowProps) =>
      isRefreshing ? '2s' : 'inherit'};
  }

  &:hover {
    cursor: ${({ isRefreshing }: TRefreshIconRowProps) => (isRefreshing ? 'default' : 'pointer')};

    path {
      fill: #3fbb7d;
    }
  }
`

const MoreButton = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    stroke: #c3c3c3;
  }

  &:hover {
    cursor: pointer;

    path {
      stroke: #3fbb7d;
    }
  }
`

const CurrencyBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 21px 0 0 0;
`

const CurrencyName = styled.p`
  margin: 0 0 0 10px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-transform: uppercase;
  color: #f7931a;
`

const Address = styled.p`
  margin: 10px 0 0 0;
  font-size: 20px;
  line-height: 25px;
  text-align: center;
  color: #7d7e8d;
  word-break: break-all;
`

const Balance = styled.p`
  margin: 10px 0 0 0;
  font-weight: 500;
  font-size: 36px;
  line-height: 36px;
  color: #1d1d22;
`

const Estimated = styled.p`
  margin: 5px 0 0 0;
  font-size: 20px;
  line-height: 23px;
  color: #7d7e8d;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  ReceiveBlock,
  UpdateBalanceBlock,
  BalanceLabel,
  Heading,
  RefreshIconRow,
  MoreButton,
  CurrencyBlock,
  CurrencyName,
  Address,
  Balance,
  Estimated,
}

export default Styles
