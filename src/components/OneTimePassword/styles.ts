import styled from 'styled-components'

type TContainerProps = {
  isError?: boolean
}

const Container = styled.div`
  & > div {
    justify-content: space-between;

    div {
      width: 45px;

      input {
        height: 50px;
        width: 45px !important;
        border: ${({ isError }: TContainerProps) => `1px solid ${isError ? '#EB5757' : '#3FBB7D'}`};
        border-radius: 8px;
        outline-color: #3fbb7d;
        font-size: 23px;
        line-height: 27px;
        color: #1d1d22;
      }
    }
  }
`

const Styles = {
  Container,
}

export default Styles
