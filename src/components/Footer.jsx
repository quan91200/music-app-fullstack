import React from 'react'
import styled from 'styled-components'

const Footer = () => {
    return (
        <Foot>Footer</Foot>
    )
}

export default Footer

const Foot = styled.div`
    position: relative;
    bottom: 0;
    inset: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3rem;
`