import React, { useContext } from 'react'
import styled from 'styled-components'
import CustomLink from './CustomLink'
import { PlainLink } from './CustomLink'
import { DarkModeContext } from '../context/DarkModeContext'

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext)

  return (
    <Wrapper className={`${isDarkMode ? 'dark' : ''}`}>
      <Logo>
        <PlainLink to="/">Soundify</PlainLink>
      </Logo>
      <div className='flex items-center gap-6'>
        <CustomLink to="/">Home</CustomLink>
        <CustomLink to="/about">About</CustomLink>
        <CustomLink to="/contact">Contact</CustomLink>
      </div>
      <div>
        <>setting</>
        <>Profile</>
        <>notification</>
      </div>
      <ToggleButton onClick={toggleDarkMode}>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </ToggleButton>
    </Wrapper>
  )
}

export default Header

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  transition: background-color 0.3s ease, padding 0.3s ease;

  &.dark {
    background-color: ${({ theme }) => theme.headerBackground};
    color: ${({ theme }) => theme.headerText};
  }
`

const Logo = styled.div`
  font-family: 'Press Start 2P', system-ui;
  font-size: 2rem;
  font-weight: bold;
`

const ToggleButton = styled.button`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.headerBackground};
  }
`