import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
`

const WalletsList = styled.div`
  position: relative;
  padding: 20px 30px;
  top: 290px;
`

const AddWalletButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #3fbb7d;
  filter: drop-shadow(0px 2px 10px rgba(125, 126, 141, 0.15));
  position: fixed;
  bottom: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    cursor: pointer;
    background-color: #31a76c;
  }
`

const NotFound = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const Styles = {
  Wrapper,
  WalletsList,
  AddWalletButton,
  NotFound,
}

export default Styles
