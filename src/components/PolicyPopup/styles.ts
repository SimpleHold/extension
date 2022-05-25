import styled from "styled-components";

const Wrapper = styled.div`
    width: 343px;
    height: 453px;
    padding: 24px 16px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: auto;
`

const Title = styled.p`
    margin: 0;
    width: 250px;
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #222834;
`

const Description = styled.p`
    margin: 24px 0 0 ;
    height: 125px;
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 25px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #74758C;
`

const DocumentsIcon = styled.div`
    width: 28px;
    height: 28px;
    background-color: #3FBB7D;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Links = styled.div`
    margin: 24px 0 0 ;
    width: 100%;
`

const LinkItem = styled.div`
    transition: 0.2s ease;
    height: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    
    span {
        margin-left: 12px;
        font-family: Inter, sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 17px;
        line-height: 25px;
        display: flex;
        align-items: center;
        color: #1D1D22;
    }
    
    > :last-child {
        margin: auto 5px auto auto;
    }

    &:last-child {
        margin-top: 15px;
    }
    
    .arrow {
        transition: 0.2s ease;
    }
    
    :hover {
        opacity: 0.9;
        span {
            color: #3FBB7D;
        }
        .arrow {
            transform: translateX(-2px);
        }
    }
`

const Buttons = styled.div`
    width: 100%;
    margin: 16px 0 0 ;
    
    .button {
       :hover {
           opacity: 0.8;
       }

        &:last-child {
            margin-top: 8px;
            height: 36px;
            background-color: transparent;
            border: none;
        .label {
            color: #3FBB7D;
        }
        }
    }
`

const Styles = {
    Wrapper,
    Title,
    Description,
    Buttons,
    Links,
    LinkItem,
    DocumentsIcon
};

export default Styles;
