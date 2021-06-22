import styled from 'styled-components'

type THeadingProps = {
  withExtraid: boolean
}

type TInputButtonProps = {
  disabled?: boolean
  withHover?: boolean
}

const Body = styled.div`
  height: 640px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`

const Heading = styled.div`
  padding: 30px 30px 0 30px;
  border-bottom: 1px solid #eaeaea;
  height: ${({ withExtraid }: THeadingProps) => (withExtraid ? '200px' : '220px')};
`

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`

const Title = styled.p`
  margin: 0 10px 5px 0;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const SiteInfo = styled.div`
  margin: 0 0 5px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const SiteFavicon = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  margin: 0 5px 0 0;
`

const SiteUrl = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const Balance = styled.p`
  margin: 31px 0 0 0;
  font-weight: 500;
  font-size: 36px;
  line-height: 42px;
  color: #1d1d22;
`

const Estimated = styled.p`
  margin: 10px 0 0 0;
  font-size: 20px;
  line-height: 23px;
  color: #7d7e8d;
`

const Form = styled.form`
  padding: 30px;
  background-color: #f8f8f8;
  flex: 1;
  border-radius: 0 0 16px 16px;
`

const NetworkFeeBlock = styled.div`
  margin: 15px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`

const NetworkFeeLabel = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: #7d7e8d;
`

const NetworkFee = styled.p`
  margin: 0 0 0 5px;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: #7d7e8d;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 63px 0 0 0;
`

const NetworkFeeError = styled.p`
  font-size: 12px;
  line-height: 14px;
  color: #eb5757;
  position: absolute;
  top: 12px;
`

const InputButton = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: ${({ disabled }: TInputButtonProps) => (disabled ? 'default' : 'pointer')};
    background-color: ${({ withHover }: TInputButtonProps) =>
      withHover ? 'rgba(234, 234, 234, 0.5)' : 'none'};
    border-radius: ${({ withHover }: TInputButtonProps) => (withHover ? '15px' : 'none')};
  }
`

const Styles = {
  Body,
  Heading,
  TitleRow,
  Title,
  SiteInfo,
  SiteFavicon,
  SiteUrl,
  Balance,
  Estimated,
  Form,
  NetworkFeeBlock,
  NetworkFeeLabel,
  NetworkFee,
  Actions,
  NetworkFeeError,
  InputButton,
}

export default Styles
