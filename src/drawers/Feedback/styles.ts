import styled from 'styled-components'

type TGradeItemProps = {
  isActive: boolean
  disabled: boolean
}

const Row = styled.div`
  margin: 20px 0 0 0;
`

const Grade = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 15px 0;
`

const GradeItem = styled.div`
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ isActive }: TGradeItemProps) => (isActive ? '#b5e0c8' : '#d7efe3')};

  &:hover {
    cursor: ${({ disabled }: TGradeItemProps) => (disabled ? 'default' : 'pointer')};
    background-color: ${({ isActive, disabled }: TGradeItemProps) =>
      disabled ? (isActive ? '#b5e0c8' : '#d7efe3') : '#b5e0c8'};
  }

  &:not(:last-child) {
    margin: 0 1px 0 0;
  }

  &:first-child {
    border-radius: 4px 0 0 4px;
  }

  &:last-child {
    border-radius: 0 4px 4px 0;
  }
`

const GradeItemNumber = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #1d1d22;
`

const Styles = {
  Row,
  Grade,
  GradeItem,
  GradeItemNumber,
}

export default Styles
