import React, { useContext } from 'react'
import styled from 'styled-components'
import CustomLink from './CustomLink'
import { PlainLink } from './CustomLink'
import { DarkModeContext } from '../context/DarkModeContext'
import ThemeToggle from './ThemeToggle'

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext)

  return (
    <Wrapper className={`${isDarkMode ? 'dark' : ''}`}>
      <Logo>
        <PlainLink to="/">Soundify</PlainLink>
      </Logo>
      <div className="flex items-center gap-6">
        <CustomLink to="/" isDarkMode={isDarkMode}>Home</CustomLink>
        <CustomLink to="/about" isDarkMode={isDarkMode}>About</CustomLink>
        <CustomLink to="/contact" isDarkMode={isDarkMode}>Contact</CustomLink>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle
          onClick={() => toggleDarkMode()}
          isDarkMode={isDarkMode}
        />
        <>Settings</>
        <>Profile</>
        <>Notifications</>
      </div>
    </Wrapper>
  )
}

export default Header

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .2rem 3rem;
  width: 100%;
`

const Logo = styled.div`
  font-family: 'Press Start 2P', system-ui;
  font-size: 1.4rem;
  font-weight: bold;
`
