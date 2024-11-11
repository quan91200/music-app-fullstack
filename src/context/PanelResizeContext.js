import React, { createContext, useState, useContext } from 'react'

// Tạo context để lưu trữ trạng thái của các panel
const PanelResizeContext = createContext()

export const usePanelResize = () => {
    return useContext(PanelResizeContext)
}

export const PanelResizeProvider = ({ children }) => {
    const [panel1Width, setPanel1Width] = useState(window.innerWidth * 0.3)
    const [panel3Width, setPanel3Width] = useState(window.innerWidth * 0.2)

    const panel1MinWidth = window.innerWidth * 0.2
    const panel1MaxWidth = window.innerWidth * 0.6
    const panel3MinWidth = window.innerWidth * 0.15
    const panel3MaxWidth = window.innerWidth * 0.2

    // Cập nhật chiều rộng của panel1
    const updatePanel1Width = (newWidth) => {
        if (newWidth >= panel1MinWidth && newWidth <= panel1MaxWidth) {
            setPanel1Width(newWidth)
        }
    }

    // Cập nhật chiều rộng của panel3
    const updatePanel3Width = (newWidth) => {
        if (newWidth >= panel3MinWidth && newWidth <= panel3MaxWidth) {
            setPanel3Width(newWidth)
        }
    }

    return (
        <PanelResizeContext.Provider
            value={{
                panel1Width,
                panel3Width,
                updatePanel1Width,
                updatePanel3Width,
                panel1MinWidth,
                panel1MaxWidth,
                panel3MinWidth,
                panel3MaxWidth,
            }}
        >
            {children}
        </PanelResizeContext.Provider>
    )
}