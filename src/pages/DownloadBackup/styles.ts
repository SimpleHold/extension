import styled from 'styled-components'

const Wrapper = styled.div`
  height: 600px;
  background-color: #ffffff;
`

const CircleRow = styled.div`
  padding: 51px 0 79px 0;
  display: flex;
  justify-content: center;
`

const Circle = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 75px;
  background-color: #dcf5ee;
`

const Row = styled.div`
  padding: 0 30px;
`

const Title = styled.p`
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  color: #1d1d22;
  margin: 0;
`

const Description = styled.p`
  margin: 10px 0;
  font-size: 16px;
  line-height: 23px;
  color: #7d7e8d;
`

const LinkRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;

    p {
      color: #3fbb7d;
    }

    path {
      fill: #3fbb7d;
    }
  }
`

const LinkIcon = styled.div`
  width: 17px;
  height: 17px;
  margin: 0 5px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Link = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: #c3c3c3;
`

const Actions = styled.div`
  margin: 37px 0 0 0;
`

const Styles = {
  Wrapper,
  CircleRow,
  Circle,
  Row,
  Title,
  Description,
  LinkRow,
  LinkIcon,
  Link,
  Actions,
}

export default Styles
