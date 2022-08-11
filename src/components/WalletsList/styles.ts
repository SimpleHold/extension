import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  transition: 0.5s ease;
  background-color: #3FBB7D;
`

const WalletsList = styled.div`
  position: relative;
  transition: 0.5s ease;

  .walletCard {
    padding: 0 20px;
    > .container {
      padding: 12px 0;
      background-color: initial;
      border-radius: 16px 16px 0 0;
      border-bottom: 1px solid #F3F3F3;
    }
  } 

  .ReactVirtualized__List {
    transition: 0.4s ease-in;
  }
`

const AddWalletButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #3fbb7d;
  filter: drop-shadow(0px 2px 10px rgba(125, 126, 141, 0.3));
  position: absolute;
  bottom: 20px;
  right: 30px;
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
  margin: 0 30px;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const List = {
  padding: '30px 0 45px',
  borderRadius: '24px 24px 0 0',
  backgroundColor: '#fff',
}

const ListItem = {

}

const Styles = {
  Wrapper,
  WalletsList,
  AddWalletButton,
  NotFound,
  List,
  ListItem,
}

export default Styles
