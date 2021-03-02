import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  background-color: #ffffff;
`

const Container = styled.div`
  height: 540px;
`

const Row = styled.div`
  padding: 30px;
`

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
`

const Description = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const Form = styled.form`
  padding: 30px;
  border-top: 1px solid #eaeaea;
  background-color: #f8f8f8;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 34px 0 0 0;
`

const AgreedBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 3px 0 0 0;
`

const AgreedText = styled.p`
  margin: 0 0 0 11px;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
`

const TermsLink = styled.span`
  color: #3fbb7d;

  &:hover {
    cursor: pointer;
  }
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Title,
  Description,
  Form,
  Actions,
  AgreedBlock,
  AgreedText,
  TermsLink,
}

export default Styles
