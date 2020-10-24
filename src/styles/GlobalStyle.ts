import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #222;
    color: #ddd;
    font-family: Roboto, Arial, Helvetica, sans-serif;
  }
`;