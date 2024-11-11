import React, { useState } from 'react';
import styled from 'styled-components';
import ResizablePanel from '../components/ResizeablePanel';

const Home = () => {
    const [isPanelVisible, setIsPanelVisible] = useState(false);

    const handleItemClick = () => {
        setIsPanelVisible(true);
    };

    return (
        <HomeWrapper>
            <MainContent panelVisible={isPanelVisible}>
                <h1>Main Content</h1>
                <button onClick={handleItemClick}>Show Panel</button>
            </MainContent>
            {isPanelVisible && (
                <ResizablePanel resizeDirection="left" minWidth={150} maxWidth={window.innerWidth * 0.3} initialWidth={300}>
                    <h2>Secondary Panel</h2>
                    <p>Content of the secondary panel...</p>
                </ResizablePanel>
            )}
        </HomeWrapper>
    );
};

export default Home;

const HomeWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
`;

const MainContent = styled.div`
    flex: ${({ panelVisible }) => (panelVisible ? '70%' : '100%')};
    padding: 16px;
    overflow: auto;
    transition: flex 0.3s ease;
`;