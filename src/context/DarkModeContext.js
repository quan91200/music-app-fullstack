import React, { createContext, useState, useEffect } from 'react'

// Tạo Context
export const DarkModeContext = createContext()

// Tạo provider cho Context
export const DarkModeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Kiểm tra trạng thái dark mode trong localStorage khi component mount
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode')
        if (savedMode !== null) {
            setIsDarkMode(savedMode === 'true')
        }
    }, []);

    // Lưu trạng thái dark mode vào localStorage mỗi khi thay đổi
    useEffect(() => {
        localStorage.setItem('darkMode', isDarkMode)
    }, [isDarkMode])

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode)
    }

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    )
}