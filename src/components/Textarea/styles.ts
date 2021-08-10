import styled from 'styled-components'

type TContainerProps = {
  isFocused: boolean
  isError: boolean
  height?: number
}

type TRowProps = {
  isActive: boolean
  openFrom?: string
}

const Container = styled.div`
  background: #ffffff;
  border: ${({ isFocused, isError }: TContainerProps) =>
    isFocused || isError ? `1px solid ${isFocused ? '#3FBB7D' : '#EB5757'}` : '1px solid #DEE1E9'};
  border-radius: 8px;
  padding: 0 15px;
  height: ${({ height }: TContainerProps) => (height ? `${height}px` : '100%')};
  display: flex;
  flex-direction: column;

  label {
    color: ${({ isFocused, isError }: TContainerProps) =>
      isError && !isFocused ? '#EB5757' : '#7D7E8D'};
  }

  &:hover {
    cursor: pointer;
  }
`

const Row = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 15px 0;

  label {
    font-size: ${({ isActive }: TRowProps) => (isActive ? '12px' : '16px')};
    line-height: ${({ isActive }: TRowProps) => (isActive ? '14px' : '19px')};
  }

  textarea {
    width: ${({ isActive }: TRowProps) => (isActive ? '100%' : '0%')};
    height: ${({ isActive }: TRowProps) => (isActive ? '100%' : '0')};
  }
`

const Label = styled.label`
  transition: all 0.3s ease-out;
`

const Textarea = styled.textarea`
  margin: 2px 0 0 0;
  font-size: 16px;
  line-height: 23px;
  color: #1d1d22;
  resize: none;
  height: 100%;
  border: none;
  outline: none;
  font-family: 'Roboto', sans-serif;
  margin: 0;
`

const Styles = {
  Container,
  Row,
  Label,
  Textarea,
}

export default Styles
