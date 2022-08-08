import styled from "styled-components";

type TContainerProps = {
  isFocused: boolean;
};

const Container = styled.div`
  padding: 8px;
  background-color: #F5F5F7;
  border: 1px solid #F5F5F7;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  transition: all 0.2s ease-in-out;

  input {
    background-color: #F5F5F7;
  }

  .search-icon {
    path {
      stroke: ${({ isFocused }: TContainerProps) =>
        isFocused ? "#3fbb7d" : "#BDC4D4"};
    }
  }

  &:hover {
    cursor: pointer;

    .search-icon {
      path {
        stroke: #3fbb7d;
      }
    }
    
    .search-button {
      background-color: #F7F8FA;
    }
  }
`;

const Input = styled.input`
  margin: 0 0 0 10px;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  border: none;
  outline: none;
  width: 100%;

  ::placeholder {
    color: #B0B0BD;
  }
  
  &:hover {
    cursor: pointer;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
`;


const Styles = {
  Container,
  Input,
  Row,
};

export default Styles;
