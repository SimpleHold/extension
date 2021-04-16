import styled from 'styled-components'

type TCurrencyBlockProps = {
  isActive: boolean
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 8px;
`

const CurrencyBlock = styled.div`
  border: 1px solid #eaeaea;
  border: ${({ isActive }: TCurrencyBlockProps) => `1px solid ${isActive ? '#3FBB7D' : '#EAEAEA'}`};
  background-color: #ffffff;
  border-radius: 5px;
  padding: 15px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    cursor: ${({ isActive }: TCurrencyBlockProps) => (isActive ? 'default' : 'pointer')};
    background-color: ${({ isActive }: TCurrencyBlockProps) => (isActive ? '#ffffff' : '#f8f8f8')};

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
