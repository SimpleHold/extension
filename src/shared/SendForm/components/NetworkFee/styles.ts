import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0 0 0;
  padding: 5px 20px 5px 5px;
  background-color: #ffffff;
  border-radius: 16px;
`

const IncludeBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`

const IncludeLabel = styled.p`
  margin: 0 6px 0 0;
  font-size: 14px;
  line-height: 16px;
  text-transform: capitalize;
  color: #7d7e8d;
`

const SwitchRow = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Styles = {
  Container,
  IncludeBlock,
  IncludeLabel,
  SwitchRow,
}

// type TFeeProps = {
//   isError: boolean
// }

// const Container = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   padding: 15px 20px;
//   border-top: 1px solid #f2f4f8;
// `

// const Row = styled.div`
//   flex: 1;
// `

// const Label = styled.p`
//   margin: 0 0 4px 0;
//   font-size: 12px;
//   line-height: 14px;
//   text-transform: capitalize;
//   color: #7d7e8d;
// `

// const Fee = styled.p`
//   margin: 0;
//   font-size: 14px;
//   line-height: 16px;
//   text-transform: capitalize;
//   color: ${({ isError }: TFeeProps) => (isError ? '#EB5757' : '#1d1d22')};
// `

// const FeeRow = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
// `

// const IconRow = styled.div`
//   margin: 0 0 0 6px;

//   path {
//     fill: #eb5757;
//   }
// `

// const Styles = {
//   Container,
//   Row,
//   Label,
//   Fee,
//   FeeRow,
//   IconRow,
// }

export default Styles
