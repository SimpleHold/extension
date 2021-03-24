import styled from 'styled-components'

type TContainerProps = {
  mt?: number
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: ${({ mt }: TContainerProps) => (mt ? `${mt}px` : '0')};

  &:hover {
    cursor: pointer;
  }
`

const Text = styled.p`
  margin: 0 0 0 11px;
  font-size: 14px;
  line-height: 16px;
  color: #7d7e8d;
`

const TermsLink = styled.span`
  color: #3fbb7d;

  &:hover {
    cursor: pointer;
  }
`

const Wrapper = {
  Container,
  Text,
  TermsLink,
}

export default Wrapper
