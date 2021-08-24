import styled from 'styled-components'

type TContainerProps = {
  disabled?: boolean
  isLight?: boolean
  ml?: number
  mr?: number
  isDanger?: boolean
  mt?: number
}

const getBackgroundColor = (props: TContainerProps) => {
  const { disabled, isLight, isDanger } = props

  if (isDanger) {
    return '#FFFFFF'
  }

  if (disabled) {
    return '#DEE1E9'
  }

  if (isLight) {
    return 'inherit'
  }

  return '#3FBB7D'
}

const getHoverBackgroundColor = (props: TContainerProps) => {
  const { disabled, isDanger, isLight } = props

  if (isLight || isDanger || disabled) {
    return getBackgroundColor(props)
  }

  return '#31A76C'
}

const getBorderColor = (props: TContainerProps) => {
  const { isLight, disabled, isDanger } = props

  if (isLight || disabled || isDanger) {
    return '#DEE1E9'
  }

  return '#3FBB7D'
}

const getHoverBorderColor = (props: TContainerProps) => {
  const { isLight, disabled, isDanger } = props

  if (isDanger) {
    return '#EB5757'
  }

  if (isLight) {
    return '#31A76C'
  }

  if (disabled) {
    return '#EAEAEA'
  }

  return '#3FBB7D'
}

const getLabelColor = (props: TContainerProps) => {
  const { disabled, isLight, isDanger } = props

  if (isDanger) {
    return '#EB5757'
  }

  if (isLight) {
    return '#3FBB7D'
  }

  if (disabled) {
    return '#7D7E8D'
  }

  return '#FFFFFF'
}

const Container = styled.button`
  width: 100%;
  border: none;
  outline: none;
  background-color: ${(props: TContainerProps) => getBackgroundColor(props)};
  border: ${(props: TContainerProps) => `1px solid ${getBorderColor(props)}`};
  height: 50px;
  border-radius: 8px;
  transition: all 0.3s;
  margin-left: ${({ ml }: TContainerProps) => (ml ? `${ml}px` : '0')};
  margin-right: ${({ mr }: TContainerProps) => (mr ? `${mr}px` : '0')};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${({ mt }: TContainerProps) => (mt ? `${mt}px` : '0')};
  user-select: none;

  &:hover {
    cursor: ${({ disabled }: TContainerProps) => (disabled ? 'default' : 'pointer')};
    background-color: ${(props: TContainerProps) => getHoverBackgroundColor(props)};
    border: ${(props: TContainerProps) => `1px solid ${getHoverBorderColor(props)}`};
  }

  p {
    color: ${(props: TContainerProps) => getLabelColor(props)};
  }
`

const Label = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
`

const IconRow = styled.div`
  margin: 0 12px 0 0;
  width: 16px;
  height: 16px;

  path {
    fill: #ffffff;
  }
`

const Styles = {
  Container,
  Label,
  IconRow,
}

export default Styles
