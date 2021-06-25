import styled from 'styled-components'

type TInputButtonProps = {
  disabled?: boolean
  withHover?: boolean
}

type TExtraIdProps = {
  withExtraid: boolean
}

const Wrapper = styled.div``

const Container = styled.div``

const Form = styled.form``

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

const NetworkFeeError = styled.p`
  font-size: 12px;
  line-height: 14px;
  color: #eb5757;
  position: absolute;
  top: 12px;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 24px 0 0 0;
`

const Styles = {
  Wrapper,
  Container,
  Form,
  InputButton,
  NetworkFeeBlock,
  NetworkFeeLabel,
  NetworkFee,
  NetworkFeeError,
  Actions,
}

export default Styles
