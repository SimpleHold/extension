import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 7.5px;
  margin-bottom: 15px;
  width: 50%;
`

const Row = styled.div`
  border: 1px solid #dee1e9;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;

  &:hover {
    cursor: pointer;
    border: 1px solid #3fbb7d;
  }
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px 16px 0 0;
`

const Body = styled.div`
  padding: 14px 15px 20px 15px;
`

const Name = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  text-transform: capitalize;
  color: #1d1d22;
`

const TokenId = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: #7d7e8d;
`

const Styles = {
  Container,
  Row,
  Image,
  Body,
  Name,
  TokenId,
}

export default Styles
