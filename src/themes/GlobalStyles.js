import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: all 0.3s ease;
  }

  header {
    background-color: ${({ theme }) => theme.headerBackground};
    color: ${({ theme }) => theme.headerText};
    padding: 1rem;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`

export default GlobalStyles
