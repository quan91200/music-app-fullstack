import React, { createContext, useState, useEffect } from 'react'

// Tạo Context
export const DarkModeContext = createContext()

// Tạo provider cho Context
export const DarkModeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode') === 'true'
        setIsDarkMode(savedMode)
    }, [])

    useEffect(() => {
        localStorage.setItem('darkMode', isDarkMode)
        if (isDarkMode) {
            document.body.classList.add('dark')
        } else {
            document.body.classList.remove('dark')
        }
    }, [isDarkMode])

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode)
    }

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    )
}