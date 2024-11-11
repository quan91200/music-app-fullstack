import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

const ResizablePanel = ({ isDarkMode, children }) => {
    const [width, setWidth] = useState(300); // Kích thước ban đầu của panel trái
    const [isResizing, setIsResizing] = useState(false);
    const [startX, setStartX] = useState(0);  // Lưu vị trí chuột khi bắt đầu kéo
    const [isHovered, setIsHovered] = useState(false);

    const minWidth = 300;  // Tương đương 30% chiều rộng màn hình
    const maxWidth = window.innerWidth * 0.7; // Tương đương 70% chiều rộng màn hình

    const handleMouseDown = (e) => {
        setIsResizing(true);
        setStartX(e.clientX); // Lưu vị trí chuột khi bắt đầu kéo
    };

    const handleMouseMove = (e) => {
        if (isResizing) {
            // Thay đổi theo vị trí chuột mới - vị trí bắt đầu
            let newWidth = width + (e.clientX - startX);
            // Đảm bảo width không nhỏ hơn minWidth và không lớn hơn maxWidth
            if (newWidth < minWidth) {
                newWidth = minWidth;
            } else if (newWidth > maxWidth) {
                newWidth = maxWidth;
            }
            setWidth(newWidth); // Cập nhật chiều rộng mới
            setStartX(e.clientX); // Cập nhật lại vị trí chuột bắt đầu
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true); // Bắt đầu hover vào Resizer
    };

    const handleMouseLeave = () => {
        setIsHovered(false); // Kết thúc hover
    };

    return (
        <Container
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <LeftPanel style={{ width }}>
                <Navbar />
            </LeftPanel>
            <Resizer
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                isHovered={isHovered}
                isDarkMode={isDarkMode}
            />
            <RightPanel>
                {children}
            </RightPanel>
        </Container>
    )
}

export default ResizablePanel

const Container = styled.div`
  display: flex;
  margin: 0 1rem;
  height: calc(100vh - 8rem);
  overflow: hidden; 
`;

const LeftPanel = styled.div`
  background-color: ${({ theme }) => theme.leftBg};
  padding: 20px;
  overflow: auto;
  border-radius: 1.2rem;
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 20px;
  background-color: ${({ theme }) => theme.rightBg};
  border-radius: 1.2rem;
`;

const Resizer = styled.div`
  width: 2px;
  margin: 1rem .25rem;
  cursor: ew-resize;
  background-color: ${({ theme }) => theme.resizer};
  position: relative;

  /* Thêm hiệu ứng hover */
  &:hover {
    background-color: ${({ theme }) => theme.resizeHover};
  }
`;