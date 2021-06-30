import styled from 'styled-components'

import logo from '@assets/fullLogo.svg'
import illustrate from '@assets/illustrate/phishing.svg'
import shieldIcons from '@assets/icons/shield.svg'

type TAgreedBlockProps = {
  isVisible: boolean
}

type TAdvancedButtonProps = {
  isVisible: boolean
  isAgreed: boolean
}

const Wrapper = styled.div`
  padding: 40px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Logo = styled.div`
  width: 161px;
  height: 24px;
  background-image: url(${logo});
  background-repeat: no-repeat;
  background-size: contain;
`

const Warning = styled.div`
  width: 800px;
  background-color: #d3ecdd;
  border-radius: 16px;
  margin: 30px 0 0 0;
`

const WarningRow = styled.div`
  padding: 50px 150px 60px 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Image = styled.div`
  width: 384px;
  height: 130px;
  background-image: url(${illustrate});
  background-repeat: no-repeat;
  background-size: contain;
`

const Title = styled.h1`
  margin: 30px 0 0 0;
  font-weight: bold;
  font-size: 30px;
  line-height: 35px;
  text-align: center;
  color: #1d1d22;
`

const Description = styled.p`
  margin: 10px 0 0 0;
  font-size: 16px;
  line-height: 26px;
  text-align: center;
  color: #1d1d22;
`

const WarningFooter = styled.div`
  padding: 20px 40px;
  border-top: 1px solid #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`

const AdvancedButton = styled.div`
  padding: 12px 20px;
  background-color: ${({ isVisible }: TAdvancedButtonProps) =>
    isVisible ? '#3FBB7D' : 'rgba(166, 217, 188, 0.5)'};
  border-radius: ${({ isVisible }: TAdvancedButtonProps) => (isVisible ? '0 5px 5px 0' : '5px')};
  transition: all 0.3s;
  opacity: ${({ isVisible, isAgreed }: TAdvancedButtonProps) =>
    isVisible && !isAgreed ? '0.5' : '1'};

  p {
    color: ${({ isVisible }: TAdvancedButtonProps) => (isVisible ? '#ffffff' : '#3fbb7d')};
  }

  &:hover {
    cursor: ${({ isVisible, isAgreed }: TAdvancedButtonProps) =>
      isVisible ? (isAgreed ? 'pointer' : 'default') : 'pointer'};
    background-color: ${({ isAgreed, isVisible }: TAdvancedButtonProps) =>
      isAgreed ? '#31A76C' : isVisible ? '#3FBB7D' : '#ffffff'};
  }
`

const AdvancedButtonTitle = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
`

const RightSiteBlock = styled.div`
  padding: 15px;
  background-color: #3fbb7d;
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 30px 0 0 0;

  &:hover {
    cursor: pointer;

    p {
      text-decoration: underline;
    }
  }
`

const RightSiteIconRow = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`

const RightSiteBlockRow = styled.div`
  margin: 0 0 0 10px;
`

const RightSiteBlockTitle = styled.span`
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
`

const RightSiteUrl = styled.p`
  margin: 5px 0 0 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`

const RightBlockIcon = styled.div`
  width: 24px;
  height: 24px;
  background-image: url(${shieldIcons});
  background-repeat: no-repeat;
  background-size: contain;
`

const AdvancedRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const AgreedBlock = styled.div`
  background-color: #ffffff;
  transition: width 0.2s ease-in-out;
  width: ${({ isVisible }: TAgreedBlockProps) => (isVisible ? '440px' : '0px')};
  border-radius: 5px 0 0 5px;
  margin: 0 1px 0 0;
  padding: ${({ isVisible }: TAgreedBlockProps) => (isVisible ? '10.5px 20px' : '0')};
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;

    p {
      color: #31a76c;
    }
  }
`

const AgreedText = styled.p`
  margin: 0 0 0 10px;
  font-size: 14px;
  line-height: 16px;
  color: #3fbb7d;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1;
`

const Styles = {
  Wrapper,
  Logo,
  Warning,
  WarningRow,
  Image,
  Title,
  Description,
  WarningFooter,
  AdvancedButton,
  AdvancedButtonTitle,
  RightSiteBlock,
  RightSiteIconRow,
  RightSiteBlockRow,
  RightSiteBlockTitle,
  RightSiteUrl,
  RightBlockIcon,
  AdvancedRow,
  AgreedBlock,
  AgreedText,
}

export default Styles
