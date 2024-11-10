import React from 'react'
import Header from '../components/Header'

const OnlyHeader = ({ children }) => {
    return (
        <div>
            <Header />
            <main>{children}</main>
        </div>
    )
}

export default OnlyHeader