import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styled from 'styled-components';
import ResizablePanel from '../components/ResizeablePanel'


const DefaultLayout = ({ children }) => {
    return (
        <Page>
            <Header />
            <Content>
                <ResizablePanel>
                    {children}
                </ResizablePanel>
            </Content>
            <Footer />
        </Page>
    );
};

export default DefaultLayout;

const Page = styled.div`
    display: grid;
    grid-template-rows: 3.2rem 1fr 3.5rem;
    height: 100vh;
    grid-template-areas: 
    "header"
    "content"
    "footer"
    ;
    grid-gap: 0.4rem;
`;

const Content = styled.div`
    overflow-y: hidden;
    max-height: calc(100vh - 8rem);
`;