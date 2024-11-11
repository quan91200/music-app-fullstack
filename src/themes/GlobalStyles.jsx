import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: all 0.3s ease;
  }

  header {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    padding: 1rem;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.scrollThumb};
    border-radius: 10px;
    border: 3px solid transparent;
    background-clip: content-box;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.scrollThumbHover};
  }

  ::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.scrollTrack};
    border-radius: 10px;
  }
`

export default GlobalStyles
