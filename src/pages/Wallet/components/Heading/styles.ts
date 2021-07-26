import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 20px 0;
  position: relative;
`

const WalletName = styled.p`
  margin: 0 10px 0 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const MoreButton = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: rgba(222, 225, 233, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #7d7e8d;
  }

  &:hover {
    cursor: pointer;
    background: rgba(222, 225, 233, 0.4);

    path {
      fill: #3fbb7d;
    }
  }
`

const RenameBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }

    p {
      color: #3fbb7d;
    }
  }
`

const Styles = {
  Container,
  WalletName,
  MoreButton,
  RenameBlock,
}

export default Styles
