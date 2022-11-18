import styled from 'styled-components'

type TContainerProps = {
  isDisabled: boolean
}

const Container = styled.div`
  padding: 4px 0 12px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: ${({ isDisabled }: TContainerProps) => (isDisabled ? 'disabled' : 'pointer')};
  }
`

const Title = styled.p`
  margin: 0 0 0 8px;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: #fa5e5e;
`

const Pressable = styled(Title)`
  margin: 0 0 0 4px;
  text-decoration: underline;

  &:hover {
    cursor: pointer;
  }
`

const Styles = {
  Container,
  Title,
  Pressable,
}

export default Styles
