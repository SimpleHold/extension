import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
		box-sizing: border-box;
  }
  
  body {
    width: 375px;
    padding: 0;
    margin: 0;
    background-color: #f8f8f8;
    font-family: 'Roboto', sans-serif;
  }
`

export default GlobalStyle
