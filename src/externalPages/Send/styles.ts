import styled from 'styled-components'

const Body = styled.div`
  height: 640px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`

const Heading = styled.div`
  padding: 30px 30px 70px 30px;
  border-bottom: 1px solid #eaeaea;
`

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Title = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #7d7e8d;
`

const SiteInfo = styled.div`
  margin: 0 0 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const SiteFavicon = styled.img`
  width: 16px;
  height: 16px;
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

const NetworkFee = styled.div`
  margin: 15px 0 0 0;
`

const NetworkFeeLabel = styled.p`
  margin: 0;
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
  NetworkFee,
  NetworkFeeLabel,
  Actions,
}

export default Styles
