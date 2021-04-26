import styled from 'styled-components'

const Wrapper = styled.div`
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  padding: 80px 0;
`

const Extension = styled.div`
  width: 375px;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  box-shadow: 0px 5px 15px rgba(125, 126, 141, 0.15);
  border-radius: 16px;
`

const Header = styled.div`
  padding: 18px 20px 18px 30px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const LogoRow = styled.div`
  width: 30px;
  height: 24px;

  path {
    fill: #3fbb7d;
  }
`

const CloseIconRow = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #cccccc;
  }

  &:hover {
    cursor: pointer;
  }
`

const Body = styled.div`
  padding: 40px 30px;
`

const Image = styled.img`
  width: 315px;
  height: 180px;
`

const Title = styled.h1`
  margin: 40px 0 0 0;
  font-size: 30px;
  line-height: 35px;
  color: #1d1d22;
`

const Description = styled.p`
  margin: 10px 0;
  font-size: 16px;
  line-height: 23px;
  color: #1d1d22;
`

const DownloadLink = styled.a`
  font-size: 16px;
  line-height: 19px;
  color: #3fbb7d;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const DividerLine = styled.div`
  margin: 56px 0 0 0;
  width: 100%;
  height: 0.5px;
  background-color: #eaeaea;
`

const QuestionBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 20px 0 0 0;
`

const Question = styled.p`
  margin: 0 0 0 7px;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
  opacity: 0.5;
  font-weight: bold;
`

const Answer = styled.p`
  margin: 5px 0 0 0;
  font-size: 14px;
  line-height: 20px;
  color: #7d7e8d;
  opacity: 0.5;
`

const Styles = {
  Wrapper,
  Extension,
  Header,
  LogoRow,
  CloseIconRow,
  Body,
  Image,
  Title,
  Description,
  DownloadLink,
  DividerLine,
  QuestionBlock,
  Question,
  Answer,
}

export default Styles
