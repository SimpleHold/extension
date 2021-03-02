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

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type=number] {
    -moz-appearance: textfield;
  } 
`

export default GlobalStyle
