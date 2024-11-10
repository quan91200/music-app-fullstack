import React from 'react'
import styled from 'styled-components'
import CustomLink from './CustomLink'
import { PlainLink } from './CustomLink'
const Header = () => {
    return (
        <div className="flex items-center gap-3 px-12 h-16 max-h-12 justify-between">
            <Logo className="font-press-start-2p text-xl cursor-pointer">
                <PlainLink to="/">Soundify</PlainLink>
            </Logo>
            <div className='flex items-center gap-6'>
                <CustomLink to="/">Home</CustomLink>
                <CustomLink to="/about">About</CustomLink>
                <CustomLink to="/contact">Contact</CustomLink>
            </div>
            <div>
                <>setting</>
                <>Profile</>
                <>notification</>
            </div>
        </div>
    )
}

export default Header

const Logo = styled.div`
  font-family: 'Press Start 2P', system-ui;
`
