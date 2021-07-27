import styled from 'styled-components'

type TExtraIdProps = {
  withExtraid: boolean
}

type TInputButtonProps = {
  disabled?: boolean
  withHover?: boolean
}

const Wrapper = styled.div`
  height: 600px;
`

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
  height: 540px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div`
  padding: ${({ withExtraid }: TExtraIdProps) =>
    withExtraid ? '30px 30px 25px 30px' : '20px 30px 40px 30px'};
`

const PageTitle = styled.p`
  margin: 0 0 20px 0;
  font-size: 16px;
  line-height: 19px;
  color: #c3c3c3;
`

const Balance = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 36px;
  line-height: 36px;
  color: #1d1d22;
`

const USDEstimated = styled.p`
  margin: 10px 0 0 0;
  font-size: 20px;
  line-height: 23px;
  color: #7d7e8d;
`

const Form = styled.form`
  padding: ${({ withExtraid }: TExtraIdProps) =>
    withExtraid ? '20px 30px' : '20px 30px 30px 30px'};
  background-color: #f8f8f8;
  border-top: 1px solid #eaeaea;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const NetworkFeeBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`

const NetworkFeeLabel = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: ${({ withExtraid }: TExtraIdProps) => (withExtraid ? '20px' : '25px')};
  color: #7d7e8d;
`

const NetworkFee = styled.p`
  margin: 0 0 0 5px;
  font-weight: bold;
  font-size: 14px;
  line-height: ${({ withExtraid }: TExtraIdProps) => (withExtraid ? '20px' : '25px')};
  color: #7d7e8d;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 24px 0 0 0;
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
  Wrapper,
  Container,
  Row,
  PageTitle,
  Balance,
  USDEstimated,
  Form,
  NetworkFeeBlock,
  NetworkFeeLabel,
  NetworkFee,
  Actions,
  NetworkFeeError,
  InputButton,
}

export default Styles
