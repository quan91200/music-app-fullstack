import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const CustomLink = ({ to, children }) => {
    return (
        <StyledNavLink to={to}>
            {children}
        </StyledNavLink>
    )
}

const PlainLink = ({ to, children }) => {
    return (
        <NavLink to={to}>
            {children}
        </NavLink>
    )
}

export default CustomLink
export { PlainLink }

const StyledNavLink = styled(NavLink)`
    position: relative;
    padding: 0.5rem 0;
    text-decoration: none;
    display: inline-block; /* Đảm bảo rằng phần tử có thể có chiều rộng tự động */
    transition: color 0.3s ease;

    // Tạo pseudo-element cho đường viền dưới
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%; /* Đảm bảo đường viền có chiều rộng bằng phần tử */
        height: 3px; /* Độ dày của đường viền */
        background-color: black;
        transform: scaleX(0); /* Đảm bảo bắt đầu thu lại */
        transform-origin: bottom left; /* Đặt điểm gốc tại bên phải */
        transition: transform 0.3s ease;
    }

    // Hover - mở rộng pseudo-element
    &:hover::after {
        transform: scaleX(1);
    }

    // Active
    &.active::after {
        transform: scaleX(1);
    }
`