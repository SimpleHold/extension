import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: scroll;
  margin: 14px 0 0 0;
`

const Network = styled.div`
  padding: 8px 16px;
  background-color: #f2f4f8;
  border-radius: 20px;
  white-space: nowrap;

  &.active {
    background-color: #3fbb7d;

    &:hover {
      cursor: default;
    }

    p {
      color: #ffffff;
    }
  }

  &:not(:last-child) {
    margin: 0 8px 0 0;
  }

  &:hover {
    cursor: pointer;
  }
`

const NetworkName = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #6d6c7e;
`

const Styles = {
  Container,
  Network,
  NetworkName,
}

export default Styles
