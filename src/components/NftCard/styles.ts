import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 7.5px;
  margin-bottom: 15px;
  width: 50%;
  height: fit-content;
  transition: all 0.2s ease-in-out;
`

const SkeletonRow = styled.div`
  background-color: #ffffff;
  border: 1px solid #dee1e9;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
`

const Row = styled.div`
  background-color: #ffffff;
  border: 1px solid #dee1e9;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  transition: all 0.1s ease-in-out;

  &:hover {
    cursor: pointer;
    border: 1px solid #3fbb7d;

    .card-body {
      background-color: #f8f9fb;
    }

    .card-name {
      color: #3fbb7d;
    }
  }
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 16px 16px 0 0;
`

const Body = styled.div`
  padding: 15px 15px 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 0 16px 16px;
  transition: all 0.1s ease-in-out;
`

const Name = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  text-transform: capitalize;
  transition: all 0.1s ease-in-out;
  color: #1d1d22;
`

const TokenId = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: #7d7e8d;
`

const SkeletonImage = styled.div`
  width: 100%;
  height: 147px;
  background-color: #f8f9fb;
  border-radius: 16px 16px 0 0;
`

const EmptyImageRow = styled.div`
  width: 100%;
  height: 150px;
  background-color: #f8f9fb;
  border-radius: 16px 16px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const EmptyImage = styled.img`
  width: 60px;
  height: 60px;
`

const Styles = {
  Container,
  Row,
  Image,
  Body,
  Name,
  TokenId,
  SkeletonImage,
  EmptyImageRow,
  EmptyImage,
  SkeletonRow,
}

export default Styles
