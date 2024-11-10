import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import styled from 'styled-components'

const DefaultLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <Page>{children}</Page>
            <Footer />
        </div>
    )
}

export default DefaultLayout

const Page = styled.div`
    margin-top: 90px;
`