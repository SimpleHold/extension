import styled from 'styled-components'

const Container = styled.div`
  background-color: #ffffff;
  width: 100%;
  border-radius: 8px;
  padding: 4px 4px 14px 4px;
`

const WalletsList = styled.div``

const Wallet = styled.div`
  background-color: #f2f4f8;
  border-radius: 5px;
  padding: 8px 12px 8px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  path {
    fill: #bdc4d4;
  }

  &:not(:first-child) {
    margin: 4px 0 0 0;
  }

  &:hover {
    cursor: pointer;
    background-color: #f8f9fb;

    path {
      fill: #3fbb7d;
    }
  }
`

const WalletName = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: #1d1d22;
`

const WalletButton = styled.div`
  width: 8px;
  height: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ShowMoreBlock = styled.div`
  margin: 12px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  svg {
    transform: rotate(270deg);

    path {
      fill: #3fbb7d;
    }
  }

  &:hover {
    cursor: pointer;
  }
`

const ShowMoreLabel = styled.p`
  margin: 0 5px 0 0;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #3fbb7d;
`

const Styles = {
  Container,
  WalletsList,
  Wallet,
  WalletName,
  WalletButton,
  ShowMoreBlock,
  ShowMoreLabel,
}

export default Styles
