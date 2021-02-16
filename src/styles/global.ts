import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
		box-sizing: border-box;
  }
  
  body {
    min-width: 430px;
    min-height: 680px; 
    padding: 0;
    margin: 0;
  }
`;

export default GlobalStyle;
