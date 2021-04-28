import styled from 'styled-components'

type TDNDAreaProps = {
  isFileBroken: boolean
}

type DNDTextProps = {
  isFileBroken?: boolean
  isFileUploaded?: boolean
}

const Wrapper = styled.div`
  background-color: #f8f8f8;
  display: flex;
  justify-content: center;
  padding: 40px 0 80px 0;
`

const Extension = styled.div`
  width: 375px;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  box-shadow: 0px 5px 15px rgba(125, 126, 141, 0.15);
  border-radius: 16px;
  position: relative;
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

const Title = styled.h1`
  margin: 0;
  font-weight: bold;
  font-size: 30px;
  line-height: 35px;
  color: #1d1d22;
`

const DNDArea = styled.div`
  padding: 0 32px;
  background-color: #f8f8f8;
  border: 1px dashed #cccccc;
  border-radius: 5px;
  margin: 30px 0 0 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 180px;

  &:hover {
    cursor: pointer;
    border: 1px dashed #3fbb7d;

    path {
      fill: ${({ isFileBroken }: TDNDAreaProps) => (isFileBroken ? '#EB5757' : '#3fbb7d')};
    }
  }
`

const FileIconRow = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const DNDText = styled.p`
  margin: 10px 0 0 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: ${({ isFileBroken, isFileUploaded }: DNDTextProps) =>
    isFileBroken || isFileUploaded ? (isFileBroken ? '#EB5757' : '#3FBB7D') : '#1d1d22'};
`

const Actions = styled.div`
  margin: 40px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const DividerLine = styled.div`
  margin: 48px 0 0 0;
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
  Wrapper,
  Extension,
  Header,
  LogoRow,
  CloseIconRow,
  Body,
  Title,
  DNDArea,
  FileIconRow,
  DNDText,
  Actions,
  DividerLine,
  QuestionBlock,
  Question,
  Answer,
}

export default Styles
