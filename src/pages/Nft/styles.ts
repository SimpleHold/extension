import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  height: 540px;
  padding: 20px 30px;
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
  margin: 4px 0 0 0;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const ContractInfo = styled.div`
  margin: 10px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ContractLabel = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #bdc4d4;
`

const ContractLink = styled.p`
  margin: 0 0 0 2px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #1d1d22;
`

const Art = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 16px;
  margin: 23px 0 0 0;
`

const Traits = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px -5px 0 -5px;
`

const Trait = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 5px 5px 5px;
`

const TraitType = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #bdc4d4;
`

const TraitValue = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #bdc4d4;
`

const Styles = {
  Wrapper,
  Container,
  Title,
  SubTitle,
  ContractInfo,
  ContractLabel,
  ContractLink,
  Art,
  Traits,
  Trait,
  TraitType,
  TraitValue,
}

export default Styles
