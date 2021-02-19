import styled from 'styled-components'

import background from '../../assets/backgrounds/main.png'

const Container = styled.div`
  width: 100%;
  height: 340px;
  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  z-index: -1;
`

const Styles = {
  Container,
}

export default Styles
