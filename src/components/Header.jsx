import React from 'react'
import styled from 'styled-components'

const Header = () => {
    return (
        <Wrapper>
            <Logo>Soundify</Logo>

        </Wrapper>
    )
}

export default Header

const Wrapper = styled.div`
    padding: .2rem 3rem;
    background-color: rgba(255,0,0,0.5);
    height: 4rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
`

const Logo = styled.div`
    font-family: "Press Start 2P", system-ui;
    font-weight: 400;
    font-style: normal;
`

const 