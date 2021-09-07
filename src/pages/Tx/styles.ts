import styled from 'styled-components'

import breakFileIcon from '@assets/icons/breakFile.svg'

type TInfoColumnRowProps = {
  pb?: number
  pt?: number
}

type TAmountProps = {
  amount: number
}

const Wrapper = styled.div`
  height: 600px;
  overflow: hidden;
`

const Container = styled.div`
  background-color: #f2f4f8;
  border-radius: 16px 16px 0px 0px;
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
  color: ${({ amount }: TAmountProps) => (amount > 0 ? '#3FBB7D' : '#1D1D22')};
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
  margin: 10px 0 0 0;
`

const HashBlock = styled.div`
  margin: 10px 0 0 0;
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

const ErrorBlock = styled.div`
  width: 100%;
  height: 333px;
  background-color: #ffffff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 32px;
`

const ErrorLoadingIcon = styled.div`
  width: 50px;
  height: 50px;
  background-image: url(${breakFileIcon});
  background-repeat: no-repeat;
  background-size: contain;
`

const ErrorLoadingText = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #7d7e8d;
`

const AddressesRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`

const Addresses = styled.p`
  margin: 0 6px 0 0;
  font-size: 16px;
  line-height: 19px;
  color: #3fbb7d;
`

const AmountRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const PendingIcon = styled.div`
  width: 16px;
  height: 16px;
  margin: 0 0 0 10px;

  path {
    fill: #bdc4d4;
  }
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
  ErrorBlock,
  ErrorLoadingIcon,
  ErrorLoadingText,
  AddressesRow,
  Addresses,
  AmountRow,
  PendingIcon,
}

export default Styles
