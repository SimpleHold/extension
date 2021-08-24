import styled from 'styled-components'

const Body = styled.div`
  padding: 40px 30px;
  background-color: #ffffff;
`

const Title = styled.h1`
  margin: 0 0 30px 0;
  font-weight: bold;
  font-size: 30px;
  line-height: 35px;
  color: #1d1d22;
`

const Actions = styled.div`
  margin: 58px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const DividerLine = styled.div`
  margin: 30px 0 0 0;
  width: 100%;
  height: 1px;
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
  Body,
  Title,
  Actions,
  DividerLine,
  QuestionBlock,
  Question,
  Answer,
}

export default Styles
