import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
		box-sizing: border-box;
  }

  html {
    height: 100%;
  }
  
  body {
    height: 100%;
    width: 375px;
    padding: 0;
    margin: 0;
    background-color: #f8f8f8;
    font-family: 'Roboto', sans-serif;
    
    * {
      max-width: 375px;
    }
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type=number] {
    -moz-appearance: textfield;
  } 
  
  ::-webkit-scrollbar {
    display: none;
  }
`

export default GlobalStyle
