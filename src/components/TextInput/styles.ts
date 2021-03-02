import styled from 'styled-components'

type TContainerProps = {
  isFocused: boolean
}

type TRowProps = {
  isActive: boolean
}

const Container = styled.div`
  height: 60px;
  background: #ffffff;
  border: ${({ isFocused }: TContainerProps) => `1px solid ${isFocused ? '#3FBB7D' : '#eaeaea'}`};
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 19px;

  &:hover {
    cursor: pointer;
  }
`

const Row = styled.div`
  height: 60px;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 11px 0;

  label {
    font-size: ${({ isActive }: TRowProps) => (isActive ? '12px' : '16px')};
    line-height: ${({ isActive }: TRowProps) => (isActive ? '14px' : '19px')};
    margin-top: ${({ isActive }: TRowProps) => (isActive ? '0' : '10px')};
  }

  input {
    width: ${({ isActive }: TRowProps) => (isActive ? '100%' : '0%')};
    height: ${({ isActive }: TRowProps) => (isActive ? '19px' : '0')};
  }
`

const Label = styled.label`
  color: #7d7e8d;
  transition: all 0.3s ease-out;
`

const Input = styled.input`
  margin: 0;
  padding: 0;
  border: none;
  height: 0;
  outline: none;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`

const VisibleInput = styled.div`
  width: 30px;
  height: 30px;
  background-color: red;
  margin: 0 0 0 10px;
`

const Styles = {
  Container,
  Row,
  Label,
  Input,
  VisibleInput,
}

export default Styles

// type TContainerProps = {
//   isFocused: boolean
// }

// type TLabelProps = {
//   isError?: boolean
// }

// const Container = styled.div`
//   width: 100%;
//   height: 60px;
//   background-color: #ffffff;
//   margin: 0 0 10px 0;
//   border: ${({ isFocused }: TContainerProps) => `1px solid ${isFocused ? '#3FBB7D' : '#EAEAEA'}`};
//   border-radius: 5px;
//   padding: 11px 20px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
// `

// const Label = styled.p`
//   margin: 0;
//   font-size: 12px;
//   line-height: 14px;
//   color: ${({ isError }: TLabelProps) => (isError ? `#EB5757` : '#7d7e8d')};
// `

// const TextInput = styled.input`
//   border: none;
//   outline: none;
//   margin: 5px 0 0 0;
//   font-weight: 500;
//   font-size: 16px;
//   line-height: 19px;
//   color: #1d1d22;
// `

// const Styles = {
//   Container,
//   Label,
//   TextInput,
// }

// export default Styles
