import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  background-color: #f2f4f8;
`

const WalletsList = styled.div`
  position: relative;
  top: 290px;

  .ReactVirtualized__List {
    overflow: inherit !important;
  }
`

const AddWalletButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #3fbb7d;
  filter: drop-shadow(0px 2px 10px rgba(125, 126, 141, 0.3));
  position: fixed;
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
  padding: '20px 0',
}

const ListItem = {
  padding: '0 30px',
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
