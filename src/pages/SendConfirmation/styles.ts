import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
`

const Row = styled.div`
  padding: 20px 30px 45px 30px;
`

const Title = styled.p`
  margin: 0 0 26px 0;
  font-weight: 500;
  font-size: 20px;
  line-height: 25px;
  color: #1d1d22;
`

const List = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 10px 0;
`

const ListTitle = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const ListText = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const DashedDivider = styled.div`
  padding: 5px 0 15px 0;
`

const DashedDividerLine = styled.div`
  width: 100%;
  height: 1px;
  border: 1px dashed #c3c3c3;
`

const Form = styled.form`
  border-top: 1px solid #eaeaea;
  background-color: #f8f8f8;
  padding: 20px 30px;
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Title,
  List,
  ListTitle,
  ListText,
  DashedDivider,
  DashedDividerLine,
  Form,
}

export default Styles
