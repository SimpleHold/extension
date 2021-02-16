import * as React from 'react';

// Components
import Header from '@components/Header';
import Cover from '@components/Cover';

// Styles
import { Wrapper } from './styles'

const Main: React.FC = () => (
  <Wrapper>
    <Header />
    <Cover />
  </Wrapper>
)

export default Main;
