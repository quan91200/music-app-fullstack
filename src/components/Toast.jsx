import React from 'react'
import styled from 'styled-components'

const Toast = ({ message, type, onClose }) => {
    return (
        <ToastWrapper type={type} onClick={onClose}>
            <p>{message}</p>
        </ToastWrapper>
    )
}

export default Toast

const ToastWrapper = styled.div`
    background-color: ${({ type }) =>
        type === 'success' ? '#4caf50' :
            type === 'error' ? '#f44336' :
                type === 'info' ? '#2196f3' : '#ff9800'};
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    position: fixed;
    top: 20px;
    right: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    z-index: 9999;
    transition: opacity 0.3s ease;
`