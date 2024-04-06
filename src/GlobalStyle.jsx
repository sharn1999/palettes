import {createGlobalStyle} from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
        font-family: "Barlow", sans-serif;
    }

    body{
        font-size: 1.2rem;
        background-color: #0F0F0F;
    }
    a{
        text-decoration: none;
        color: #fff;
    }
`;