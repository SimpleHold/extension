import styled from 'styled-components'

import connectImage from '@assets/illustrate/connectLedger.svg'

const Wrapper = styled.div`
  height: 640px;
`

const Container = styled.div`
  padding: 40px 30px 30px 30px;
  display: flex;
  flex-direction: column;
  height: 570px;
`

const Row = styled.div`
  flex: 1;
`

const ConnectImage = styled.div`
  width: 100%;
  height: 180px;
  background-image: url(${connectImage});
`

const Title = styled.h1`
  margin: 40px 0 0 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  text-align: center;
  color: #1d1d22;
`

const Description = styled.p`
  margin: 8px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #7d7e8d;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  ConnectImage,
  Title,
  Description,
}

export default Styles
