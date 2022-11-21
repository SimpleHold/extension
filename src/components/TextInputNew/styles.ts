import styled from 'styled-components'
import NumberFormat from 'react-number-format'

import eyeIcon from '@assets/icons/eye.svg'
import eyeVisibleIcon from '@assets/icons/eyeVisible.svg'

type TContainerProps = {
  isFocused: boolean
  isError: boolean
  disabled?: boolean
  pr: number
}

type TRowProps = {
  isActive: boolean
  openFrom?: string
}

type TEyeIconPRops = {
  isVisible: boolean
}

const Container = styled.div`
  margin: 14px 16px;
  height: 32px;
  background: #f5f5f7;
  border: ${({ isFocused, isError }: TContainerProps) =>
    isFocused || isError ? `1px solid ${isFocused ? '#3FBB7D' : '#EB5757'}` : '1px solid #F5F5F7'};
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  padding-right: ${({ pr }: TContainerProps) => `${pr}px`};
  position: relative;
  user-select: none;

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
  padding: 11px 0 10px 0;

  label {
    font-size: ${({ isActive }: TRowProps) => (isActive ? '10px' : '13px')};
    line-height: ${({ isActive }: TRowProps) => (isActive ? '14px' : '2px')};
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
    height: 32px;
    background: transparent;
    width: ${({ isActive }: TRowProps) => (isActive ? '100%' : '0%')};
    // height: ${({ isActive }: TRowProps) => (isActive ? '19px' : '0')};
  }
`

const Label = styled.label`
  transition: all 0.3s ease-out;
  margin-right: 6px;
`

const Input = styled.input`
  //margin: 2px 0 0 0;
  padding: 0;
  border: none;
  height: 32px;
  outline: none;
  color: #1d1d22;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  //line-height: 22px;

  ::placeholder {
    color: #b0b0bd;
  }

  &:disabled {
    background-color: #ffffff !important;
    color: #1d1d22;
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
    color: #1d1d22;
  }
`

const ClearButton = styled.div`
  width: 24px;
  height: 24px;
  margin: 0 0 0 10px;
  background-color: #f2f4f8;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  path {
    fill: #7d7e8d;
  }

  &:hover {
    cursor: pointer;

    path {
      fill: #3fbb7d;
    }
  }
`

const Button = styled.div`
  padding: 6px 10px;
  background: #e9f5ee;
  border-radius: 5px;
  position: absolute;
  right: 9px;
  bottom: 9px;
  transition: all 0.3s;

  &:hover {
    cursor: pointer;
    background: #3fbb7d;

    p {
      color: #ffffff;
    }
  }
`

const ButtonLabel = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #3fbb7d;
`

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  path {
    fill: #eb5757;
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
  ClearButton,
  Button,
  ButtonLabel,
  LabelRow,
}

export default Styles
