import styled from 'styled-components'

type TDrag = {
  isDragActive: boolean
  isSuccess?: boolean
  isError?: boolean
}

type TDNDText = {
  type?: 'success' | 'error'
}

const Wrapper = styled.div`
  height: 600px;
  background-color: #ffffff;
`

const Container = styled.div`
  padding: 20px 30px 0 30px;
  height: 540px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div``

const Title = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
`

const Text = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 0 30px 0;
`

const DNDBlock = styled.div`
  padding: 10px;
  background-color: #fafafa;
  border-radius: 5px;
  outline: none;
  margin: 30px 0 0 0;
`

const DNDArea = styled.div`
  border: ${({ isDragActive }: TDrag) =>
    isDragActive ? `1px dashed #3FBB7D` : '1px dashed #dfdfdf'};
  border-radius: 5px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & span {
    color: ${({ isDragActive }: TDrag) =>
      isDragActive ? '#3FBB7D!important' : '#C3C3C3!important'};
  }

  &:hover {
    border: 1px dashed #3fbb7d;
    cursor: pointer;

    span {
      color: #3fbb7d;
    }

    path {
      fill: #3fbb7d;
    }
  }
`

const DNDIconRow = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: ${({ isDragActive }: TDrag) => (isDragActive ? '#3FBB7D' : '#C3C3C3')};
  }
`

const DNDText = styled.span`
  margin: 10px 0 0 0;
  font-size: 14px;
  line-height: 16px;
  color: ${({ type }: TDNDText) =>
    type ? (type === 'success' ? '#3FBB7D' : '#EB5757') : '#C3C3C3'};
`

const Styles = {
  Wrapper,
  Container,
  Row,
  Title,
  Text,
  Actions,
  DNDBlock,
  DNDArea,
  DNDIconRow,
  DNDText,
}

export default Styles
