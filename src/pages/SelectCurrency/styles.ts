import styled from 'styled-components'

type TCurrencyLogoRowProps = {
  background: string
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
  padding: 30px 30px 0 30px;
`

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 25px;
  color: #1d1d22;
`

const Actions = styled.div`
  padding: 29px 30px 30px 30px;
`

const CurrenciesList = styled.div`
  margin: 20px 0 0 0;
  display: flex;
  flex-wrap: wrap;
`

const CurrencyBlock = styled.div`
  width: 33%;
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
    border: 1px solid #eaeaea;

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

const Styles = {
  Wrapper,
  Container,
  Row,
  Title,
  Actions,
  CurrenciesList,
  CurrencyBlock,
  CurrencyName,
  CurrencySymbol,
}

export default Styles
