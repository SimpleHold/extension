import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
  height: 540px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div`
  padding: 30px 30px 0 30px;
`

const Title = styled.p`
  margin: 0 0 20px 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 25px;
  color: #1d1d22;
`

const CurrenciesList = styled.div`
  margin: 20px 0 0 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 8px;
  max-height: 355px;
  overflow-y: scroll;
`

const CurrencyBlock = styled.div`
  border: 1px solid #eaeaea;
  background-color: #ffffff;
  border-radius: 5px;
  padding: 15px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: #f8f8f8;

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
  margin: 10px 0 0 0px;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Title,
  CurrenciesList,
  CurrencyBlock,
  CurrencyName,
  CurrencySymbol,
  CustomTokenLogo,
  CustomTokenLabel,
  NotFoundMessage,
}

export default Styles
