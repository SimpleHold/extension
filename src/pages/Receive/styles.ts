import styled, { keyframes } from 'styled-components'

const rotating = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

type TRefreshButtonProps = {
  isRefreshing: boolean
}

type TCurrencyNameProps = {
  size: 'small' | 'normal'
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div`
  padding: 20px 30px 35px 30px;
  position: relative;
`

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Currency = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
`

const CurrencyName = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: ${({ size }: TCurrencyNameProps) => (size === 'small' ? '14px' : '20px')};
  line-height: ${({ size }: TCurrencyNameProps) => (size === 'small' ? '16px' : '23px')};
  color: #1d1d22;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > div {
    &:not(:last-child) {
      margin: 0 5px 0 0;
    }
  }
`

const Action = styled.div`
  width: 30px;
  height: 30px;
  background: rgba(234, 234, 234, 0.5);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #c3c3c3;
  }

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }
  }
`

const ReceiveBlock = styled.div`
  border-top: 1px solid #eaeaea;
  padding: 20px 30px 30px 30px;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
`

const Address = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #7d7e8d;
  word-break: break-all;
`

const BalanceRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 30px 0 0 0;
`

const Balance = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 32px;
  line-height: 32px;
  white-space: nowrap;
  color: #1d1d22;
`

const RefreshButton = styled.div`
  width: 30px;
  height: 30px;
  background: rgba(234, 234, 234, 0.5);
  border-radius: 15px;
  margin: 0 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: ${({ isRefreshing }: TRefreshButtonProps) => (isRefreshing ? '#3fbb7d' : '#c3c3c3')};
  }

  svg {
    animation: ${rotating} 2s infinite linear;
    animation-duration: ${({ isRefreshing }: TRefreshButtonProps) =>
      isRefreshing ? '2s' : 'inherit'};
  }

  &:hover {
    cursor: ${({ isRefreshing }: TRefreshButtonProps) => (isRefreshing ? 'default' : 'pointer')};

    path {
      fill: #3fbb7d;
    }
  }
`

const Estimated = styled.p`
  margin: 10px 0 0 0;
  font-size: 20px;
  line-height: 23px;
  color: #7d7e8d;
`

const PendingRow = styled.div`
  margin: 20px 0 0 0;
`

const HeadingRow = styled.div`
  margin: 0 0 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const HardwareBlock = styled.div`
  margin: 0 0 1px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const HardwareLabel = styled.p`
  margin: 0 5px 0 0;
  font-size: 12px;
  line-height: 14px;
  color: #7d7e8d;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Heading,
  Currency,
  CurrencyName,
  Actions,
  Action,
  BalanceRow,
  Balance,
  RefreshButton,
  Estimated,
  PendingRow,
  ReceiveBlock,
  Address,
  HeadingRow,
  HardwareBlock,
  HardwareLabel,
}

export default Styles
