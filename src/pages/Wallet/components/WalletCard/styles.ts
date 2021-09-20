import styled, { keyframes } from 'styled-components'

type TRefreshButtonProps = {
  isRefreshing: boolean
}

type TBalanceProps = {
  height: number
}

type TEstimatedProps = {
  mt: number
}

const rotating = keyframes`
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
`

const Container = styled.div``

const Body = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid #f2f4f8;
`

const ActionButton = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  background-color: #ffffff;

  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.5);
  }

  &:not(:first-child) {
    border-left: 1px solid #f2f4f8;
  }

  &:first-child {
    border-bottom-left-radius: 16px;
    border-radius: 0 0 0 16px;
  }

  &:last-child {
    border-bottom-right-radius: 16px;
  }
`

const ActionName = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #3fbb7d;
`

const WalletInfo = styled.div`
  margin: 0 0 0 20px;
`

const BalanceRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Balance = styled.p`
  font-weight: 500;
  font-size: ${({ height }: TBalanceProps) => `${height}px`};
  line-height: ${({ height }: TBalanceProps) => `${height}px`};
  color: #1d1d22;
  margin: 0;
`

const Estimated = styled.p`
  margin: 0;
  margin-top: ${({ mt }: TEstimatedProps) => `${mt}px`};
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const RefreshButton = styled.div`
  width: 16px;
  height: 16px;
  margin: -2px 0 0 8px;

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

const Styles = {
  Container,
  Body,
  Actions,
  ActionButton,
  ActionName,
  WalletInfo,
  BalanceRow,
  Balance,
  Estimated,
  RefreshButton,
}

export default Styles
