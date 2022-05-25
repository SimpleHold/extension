import styled from 'styled-components'

const Wrapper = styled.div`
  margin-top: 22px;
  height: 600px;
  overflow: hidden;
  
  .wallets-list {
    padding: 0 0 75px !important;
  }
  
  .tabs-container {
  }
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  height: 540px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const SearchContainer = styled.div`
  padding: 14px 16px;
  border-top: 1px solid #EBEBEE;
`

const Row = styled.div`
  margin: 30px 0 0 0;
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

const CurrenciesList = styled.div`
  margin: 20px 0 0 0;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 8px;
  max-height: 355px;
  overflow-y: scroll;
`

const CurrencyBlock = styled.div`
  border: 1px solid #dee1e9;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 15px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  transition: 0.1s ease;

  &:hover {
    transition: none;
    cursor: pointer;
    background-color: #f8f9fb;
    border: 1px solid #3fbb7d;

    p > {
      color: #3fbb7d;
    }
  }
`

const CurrencyName = styled.p`
  margin: 10px 0 0 0;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  text-transform: capitalize;
  color: #1d1d22;
`

const CurrencySymbol = styled.p`
  margin: 2px 0 0 0;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  text-transform: uppercase;
  color: #7d7e8d;
`

const CustomTokenLogo = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.1) 100%),
    #c3c3c3;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    path {
      fill: #ffffff;
    }
  }
`

const CustomTokenLabel = styled.p`
  margin: 10px 0 0 0;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  text-transform: capitalize;
  color: #3fbb7d;
`

const NotFoundMessage = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const Tab = styled.div`
`

const CustomTokenBlock = styled(CurrencyBlock)`
  border: 1px solid #ffffff;

  &:hover {
    background-color: #ffffff;
    border: 1px solid #ffffff;

    > div {
      background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.7) 0%,
          rgba(255, 255, 255, 0.1) 100%
        ),
        #3fbb7d;
    }
  }
`

const Styles = {
  Wrapper,
  Container,
  SearchContainer,
  WalletsList,
  AddWalletButton,
  NotFound,
  List,
  ListItem,
  Row,
  Tab,
  NotFoundMessage,
  CurrenciesList,
  CurrencyBlock,
  CurrencyName,
  CurrencySymbol,
  CustomTokenLogo,
  CustomTokenLabel,
  CustomTokenBlock,
}

export default Styles
