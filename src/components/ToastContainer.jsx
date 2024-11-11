import React, { useState, useImperativeHandle, forwardRef } from 'react'
import styled from 'styled-components'

const ToastContainer = forwardRef((props, ref) => {
    const [toasts, setToasts] = useState([])

    // Cung cấp phương thức `addToast` để có thể gọi từ ngoài
    useImperativeHandle(ref, () => ({
        addToast: (message, type) => {
            const newToast = { id: Date.now(), message, type }
            setToasts((prevToasts) => [...prevToasts, newToast])

            // Tự động xóa toast sau 3 giây
            setTimeout(() => {
                setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== newToast.id))
            }, 3000)
        }
    }))

    return (
        <ToastWrapper>
            {toasts.map((toast) => (
                <Toast key={toast.id} type={toast.type}>
                    {toast.message}
                </Toast>
            ))}
        </ToastWrapper>
    )
})

export default ToastContainer

const ToastWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`

const Toast = styled.div`
  background-color: ${({ type }) => (type === 'error' ? '#f44336' : type === 'info' ? '#2196F3' : '#4CAF50')};
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  transition: opacity 0.3s ease-out;

  &:last-child {
    margin-bottom: 0;
  }
`