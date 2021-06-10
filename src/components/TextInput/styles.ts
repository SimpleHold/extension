import styled from 'styled-components'
import NumberFormat from 'react-number-format'

import eyeIcon from '@assets/icons/eye.svg'
import eyeVisibleIcon from '@assets/icons/eyeVisible.svg'

type TContainerProps = {
  isFocused: boolean
  isError: boolean
  disabled?: boolean
  withButton: boolean
}

type TRowProps = {
  isActive: boolean
  openFrom?: string
}

type TEyeIconPRops = {
  isVisible: boolean
}

const Container = styled.div`
  height: 60px;
  background: #ffffff;
  border: ${({ isFocused, isError }: TContainerProps) =>
    isFocused || isError ? `1px solid ${isFocused ? '#3FBB7D' : '#EB5757'}` : '1px solid #eaeaea'};
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 10px 0;
  padding: ${({ withButton }: TContainerProps) => (withButton ? '0 12px 0 20px' : '0 20px')};

  label {
    color: ${({ isFocused, isError }: TContainerProps) =>
      isError && !isFocused ? '#EB5757' : '#7D7E8D'};
  }

  &:hover {
    cursor: ${({ disabled }: TContainerProps) => (disabled ? 'default' : 'pointer')};
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
    margin-top: ${({ isActive, openFrom }: TRowProps) =>
      isActive
        ? openFrom === 'browser'
          ? '10px'
          : '0'
        : openFrom === 'browser'
        ? '20px'
        : '10px'};
  }

  input {
    width: ${({ isActive }: TRowProps) => (isActive ? '100%' : '0%')};
    height: ${({ isActive }: TRowProps) => (isActive ? '19px' : '0')};
  }
`

const Label = styled.label`
  transition: all 0.3s ease-out;
`

const Input = styled.input`
  margin: 5px 0 0 0;
  padding: 0;
  border: none;
  height: 0;
  outline: none;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;

  &:disabled {
    background-color: #ffffff !important;
    color: #7d7e8d;
  }
`

const VisibleInput = styled.div`
  width: 30px;
  height: 30px;
  margin: 0 0 0 10px;

  &:hover {
    cursor: pointer;
  }
`

const EyeIcon = styled.div`
  width: 30px;
  height: 30px;
  background-image: ${({ isVisible }: TEyeIconPRops) =>
    `url(${isVisible ? eyeVisibleIcon : eyeIcon})`};
`

const NumberInput = styled(NumberFormat)`
  margin: 5px 0 0 0;
  padding: 0;
  border: none;
  height: 0;
  outline: none;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;

  &:disabled {
    background-color: #ffffff !important;
    color: #7d7e8d;
  }
`

const Styles = {
  Container,
  Row,
  Label,
  Input,
  VisibleInput,
  EyeIcon,
  NumberInput,
}

export default Styles
