import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #f2f4f8;
  border-radius: 16px 16px 0 0;
  height: 540px;
  overflow: scroll;
  padding: 20px 30px;
`

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
`

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 15px -7.5px 0 -7.5px;
`

const Styles = {
  Wrapper,
  Container,
  Title,
  List,
}

export default Styles
