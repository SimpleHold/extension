import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 60px;
  background-color: #ffffff;
  margin: 0 0 10px 0;
  border: 1px solid #eaeaea;
  border-radius: 5px;
  padding: 11px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Label = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 14px;
  color: #7d7e8d;
`;

const TextInput = styled.input`
  border: none;
  outline: none;
  margin: 5px 0 0 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #1d1d22;
`;

const Styles = {
  Container,
  Label,
  TextInput,
};

export default Styles;
