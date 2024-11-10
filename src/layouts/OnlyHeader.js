import React from 'react'
import Header from '../components/Header'
import styled from 'styled-components'

const OnlyHeader = ({ children }) => {
    return (
        <div>
            <Header />
            <Page>{children}</Page>
        </div>
    )
}

export default OnlyHeader

const Page = styled.div`
    margin-top: 90px;
`