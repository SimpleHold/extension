import styled from 'styled-components';

const Wrapper = styled.div``;

const Container = styled.div`
  background-color: #f8f8f8;
  border-radius: 5px 5px 0 0;
  height: 540px;
`;

const Heading = styled.div`
  padding: 20px 30px 40px 30px;
  border-bottom: 1px solid #eaeaea;
  background-color: #ffffff;
  border-radius: 5px 5px 0 0;
`;

const Title = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 19px;
  color: #c3c3c3;
`;

const Balance = styled.p`
  font-weight: 500;
  margin: 21px 0 5px 0;
  font-size: 36px;
  line-height: 42px;
  color: #1d1d22;
`;

const USDEstimated = styled.p`
  margin: 0;
  font-size: 20px;
  line-height: 23px;
  color: #7d7e8d;
`;

const Form = styled.form`
  padding: 20px 30px;
`;

const NetworkFeeBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const NetworkFeeLabel = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 25px;
  color: #7d7e8d;
`;

const NetworkFee = styled.p`
  margin: 0 0 0 10px;
  font-weight: bold;
  font-size: 16px;
  line-height: 25px;
  color: #7d7e8d;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 25px 0 0 0;
`;

const Styles = {
  Wrapper,
  Container,
  Heading,
  Title,
  Balance,
  USDEstimated,
  Form,
  NetworkFeeBlock,
  NetworkFeeLabel,
  NetworkFee,
  Actions,
};

export default Styles;
