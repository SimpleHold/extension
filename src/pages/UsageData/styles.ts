import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
`

const Container = styled.div`
  padding: 20px 30px 0 30px;
`

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  text-transform: capitalize;
  color: #1d1d22;
`

const Description = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const FeaturesBlock = styled.div`
  margin: 30px 0 0 0;
`

const FeaturesTitle = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const FeaturesList = styled.div`
  margin: 20px 0 0 0;
`

const Feature = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;

  &:not(:last-child) {
    margin: 0 0 30px 0;
  }
`

const FeatureLine = styled.div`
  width: 1px;
  height: 100%;
  background-color: #3fbb7d;
  position: absolute;
  left: 10px;
`

const FeatureIcon = styled.div`
  width: 21px;
  height: 21px;
  background-color: #3fbb7d;
  border-radius: 12px;
  position: absolute;
`

const Features = styled.div`
  margin: 0 0 0 30px;
`

const FeatureText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: #1d1d22;

  &:not(:last-child) {
    margin: 0 0 10px 0;
  }
`

const Actions = styled.div``

const Styles = {
  Wrapper,
  Container,
  Title,
  Description,
  FeaturesBlock,
  FeaturesTitle,
  FeaturesList,
  Feature,
  FeatureLine,
  FeatureIcon,
  Features,
  FeatureText,
  Actions,
}

export default Styles
