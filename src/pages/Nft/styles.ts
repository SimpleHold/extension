import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  height: 540px;
  padding: 20px 30px 30px 30px;
  overflow: scroll;
`

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
`

const SubTitle = styled.p`
  margin: 3px 0 0 0;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const EmptyImageRow = styled.div`
  margin: 20px 0 0 0;
  width: 100%;
  height: 315px;
  background-color: #f2f4f8;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Traits = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 14px -3.5px 0 -3.5px;
`

const Trait = styled.div`
  padding: 7px 10px;
  background: #f2f4f8;
  border-radius: 8px;
  margin: 6px 3.5px 0 3.5px;
`

const TraitValue = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: #1d1d22;
`

const ContractBlock = styled.div`
  padding: 15px 15px 15px 20px;
  filter: drop-shadow(0px 2px 20px rgba(125, 126, 141, 0.1));
  background-color: #ffffff;
  border-radius: 16px;
  margin: 20px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ContractBlockRow = styled.div`
  flex: 1;
  margin: 0 16px 0 0;
`

const ContractBlockLabel = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #bdc4d4;
`

const ContractBlockLink = styled.p`
  margin: 5px 0 0 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const ContractButton = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #f2f4f8;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #bdc4d4;
  }

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }
  }
`

const EmptyImage = styled.img`
  width: 126px;
  height: 126px;
`

const Image = styled.img`
  width: 100%;
  height: 315px;
  object-fit: contain;
  margin: 20px 0 0 0;
  border-radius: 16px;
`

const Styles = {
  Wrapper,
  Container,
  Title,
  SubTitle,
  EmptyImageRow,
  Traits,
  Trait,
  TraitValue,
  ContractBlock,
  ContractBlockRow,
  ContractBlockLabel,
  ContractBlockLink,
  ContractButton,
  EmptyImage,
  Image,
}

export default Styles
