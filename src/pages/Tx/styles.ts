import styled from 'styled-components'

type TInfoColumnRowProps = {
  pb?: number
  pt?: number
}

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #f2f4f8;
  border-radius: 5px 5px 0px 0px;
  height: 540px;
  padding: 20px 30px 30px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Body = styled.div``

const Heading = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const HeadingInfo = styled.div`
  margin: 0 0 0 15px;
`

const Amount = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
`

const Estimated = styled.p`
  margin: 4px 0 0 0;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const Info = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  margin: 10px 0;
`

const HashBlock = styled.div`
  padding: 15px 20px;
  background-color: #ffffff;
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const HashBlockRow = styled.div`
  flex: 1;
`

const Label = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #bdc4d4;
`

const Text = styled.p`
  margin: 5px 0 0 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const CopyButton = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #f2f4f8;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }
  }
`

const InfoColumn = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid #f2f4f8;
  }
`

const InfoColumnRow = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ pt }: TInfoColumnRowProps) => (pt ? `${pt}px` : '20px')};
  padding-bottom: ${({ pb }: TInfoColumnRowProps) => (pb ? `${pb}px` : '20px')};
`

const InfoLabel = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #bdc4d4;
`

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const InfoBold = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const InfoText = styled.p`
  margin: 5px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
`

const Date = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const Styles = {
  Wrapper,
  Container,
  Body,
  Heading,
  HeadingInfo,
  Amount,
  Estimated,
  Info,
  HashBlock,
  HashBlockRow,
  Label,
  Text,
  CopyButton,
  InfoColumn,
  InfoColumnRow,
  InfoLabel,
  InfoContent,
  InfoBold,
  InfoText,
  Date,
}

export default Styles
