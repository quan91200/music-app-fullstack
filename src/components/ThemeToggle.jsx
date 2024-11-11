import React from 'react'
import styled from 'styled-components'

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  width: 50px;
  height: 50px;
  transition: background-color 0.3s ease;
`

const MoonIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({ isDarkMode }) => (isDarkMode ? 'yellow' : '#467fff')};
  position: relative;
  transition: background 0.3s ease;

  &:before {
    content: '';
    position: absolute;
    top: 5px;
    left: ${({ isDarkMode }) => (isDarkMode ? '10px' : '0')};
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${({ isDarkMode }) => (isDarkMode ? 'rgba(0, 0, 0, 1)' : '#467fff')};
    transition: left 0.3s ease;
  }
`

const ThemeToggle = ({ isDarkMode, onClick }) => {
  return (
    <ToggleButton onClick={onClick}>
      <MoonIcon isDarkMode={isDarkMode} />
    </ToggleButton>
  )
}

export default ThemeToggle